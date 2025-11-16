// /src/hooks/usePiWebRTC.ts
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";

export function usePiWebRTC(deviceId: string | null) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!deviceId) return;
    socket.emit("dashboard_ready", { deviceId });

    if (pcRef.current) {
      try { pcRef.current.close(); } catch (e) { console.log(e) }
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      console.log("🔥 TRACK RECEIVED:", event.track.kind, event.streams);
      if (!videoRef.current) return;
      videoRef.current.srcObject = event.streams[0];

      videoRef.current.play().catch(() => {
        console.warn("⚠ Autoplay blocked, waiting for user interaction");
      });
    };

    // Listen OFFER from Pi
    const handleOffer = async (data: any) => {
      if (!data || data.deviceId !== deviceId) return;

      console.log("📡 OFFER received for", data.deviceId);

      try {
        await pc.setRemoteDescription({
          type: "offer",
          sdp: data.sdp,
        });

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc_answer", {
          deviceId,
          sdp: answer.sdp,
          type: answer.type,
        });

        console.log("📡 ANSWER sent");
      } catch (err) {
        console.error("❌ Error processing offer:", err);
      }
    };

    socket.on("webrtc_offer", handleOffer);

    // Listen ICE from Pi
    const handleIce = async (data: any) => {
      if (!data || data.deviceId !== deviceId) return;
      if (!data.candidate) return;

      try {
        await pc.addIceCandidate({
          candidate: data.candidate,
          sdpMid: data.sdpMid,
          sdpMLineIndex: data.sdpMLineIndex,
        });
      } catch (err) {
        console.warn("❌ Error adding ICE:", err);
      }
    };

    socket.on("webrtc_ice_candidate", handleIce);

    // Send ICE to Pi
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc_ice_candidate", {
          deviceId,
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        });
      }
    };

    return () => {
      socket.off("webrtc_offer", handleOffer);
      socket.off("webrtc_ice_candidate", handleIce);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [deviceId]);

  return { videoRef };
}


