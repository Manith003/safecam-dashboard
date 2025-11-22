import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

let sharedPC: RTCPeerConnection | null = null;
let sharedStream: MediaStream | null = null;
let isListening = false;
const subscribers = new Set<(stream: MediaStream | null) => void>(); 

export function usePiWebRTC(deviceId: string) {
  const [stream, setStream] = useState<MediaStream | null>(sharedStream);

  useEffect(() => {
    subscribers.add(setStream);
    
    if (sharedStream) {
      setStream(sharedStream);
    }

    if (!deviceId) return;

    //Setup WebRTC (Only once globally)
    const initGlobalWebRTC = async () => {
      if (sharedPC && sharedPC.connectionState !== 'closed') {
        if (!sharedStream) {
            socket.emit("dashboard_ready", { deviceId });
        }
        return; 
      }

      console.log("🚀 Initializing Global WebRTC Connection...");
      
      sharedPC = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });

      sharedPC.ontrack = (event) => {
        console.log("🎥 Stream Received");
        if (event.streams && event.streams[0]) {
          sharedStream = event.streams[0];
          subscribers.forEach(callback => callback(sharedStream));
        }
      };

      sharedPC.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            deviceId,
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
          });
        }
      };

      //Setup Socket Listeners (Only ONCE globally)
      if (!isListening) {
        const handleOffer = async (data: any) => {
          if (!data || data.deviceId !== deviceId) return;
          if (!sharedPC) return;

          try {
            // Reset if strictly needed, otherwise just set remote
            if (sharedPC.signalingState !== "stable") {
                await Promise.all([
                    sharedPC.setLocalDescription({type: "rollback"}),
                    sharedPC.setRemoteDescription({ type: "offer", sdp: data.sdp })
                ]);
            } else {
                await sharedPC.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
            }

            const answer = await sharedPC.createAnswer();
            await sharedPC.setLocalDescription(answer);

            socket.emit("webrtc_answer", {
              deviceId,
              sdp: answer.sdp,
              type: answer.type,
            });
          } catch (err) {
            console.error("❌ Error processing offer:", err);
          }
        };

        const handleIce = async (data: any) => {
          if (data.deviceId !== deviceId) return;
          if (!sharedPC || !data.candidate) return;
          try {
            await sharedPC.addIceCandidate(new RTCIceCandidate({
                candidate: data.candidate,
                sdpMid: data.sdpMid,
                sdpMLineIndex: data.sdpMLineIndex,
            }));
          } catch (err) {
            console.warn("❌ Error adding ICE:", err);
          }
        };

        socket.on("webrtc_offer", handleOffer);
        socket.on("webrtc_ice_candidate", handleIce);
        isListening = true;
      }

      // Start the process
      socket.emit("dashboard_ready", { deviceId });
    };

    initGlobalWebRTC();

    //Cleanup (Per Component)
    return () => {
      subscribers.delete(setStream);
    };
  }, [deviceId]);

  return { stream };
}