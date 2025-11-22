import { type Alert } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  User,
  Radio,
  // Siren,
  XCircle,
  CheckCircle,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePiWebRTC } from "@/hooks/usePiWebRTC";
// import { useEffect, useRef } from "react";

interface AlertPopupProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
  // onTriggerSiren: () => void; //later added trigger button if want.
}

export function AlertPopup({
  alert,
  isOpen,
  onClose,
  onConfirm,
  onDismiss,
  // onTriggerSiren, //later added trigger button if want.
}: AlertPopupProps) {
  const { stream } = usePiWebRTC("Pi-Unit-001");
  // const videoRef = useRef<HTMLVideoElement | null>(null);

  // useEffect(() => {
  //   if (!isOpen) return;

  //   const timeout = setTimeout(() => {
  //     if (videoRef.current && stream) {
  //       console.log("🎥 Attaching stream inside AlertPopup");
  //       videoRef.current.srcObject = stream;
  //       videoRef.current.play().catch(() => {});
  //     }
  //   }, 100); 

  //   return () => clearTimeout(timeout);
  // }, [stream, isOpen]);
  const setVideoRef = (videoElement: HTMLVideoElement | null) => {
    if (videoElement && stream) {
      console.log("🎥 Attaching stream to Popup Video");
      videoElement.srcObject = stream;
      videoElement.play().catch((e) => console.error("Autoplay blocked", e));
    }
  };

  if (!alert) return null;

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-2 border-[#FF3B3B] bg-[#0A0E16]/95 p-0 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 animate-pulse rounded-lg bg-gradient-to-r from-[#FF3B3B] via-red-500 to-[#FF3B3B] opacity-40 blur-sm" />

          <div className="relative w-[33vw] md:w-[36vw] rounded-lg bg-[#0A0E16] p-6">
            <DialogTitle className="sr-only">Alert Notification</DialogTitle>
            <DialogDescription className="sr-only">
              Alert detected at {alert.location}, device {alert.deviceId}
            </DialogDescription>

            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF3B3B]/20">
                  <Bell className="h-6 w-6 text-[#FF3B3B]" />
                </div>
                <div>
                  <h2 className="text-white">New Alert Detected</h2>
                  <p className="text-gray-400">Immediate attention required</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#FF3B3B] px-3 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                <span className="text-white">URGENT</span>
              </div>
            </div>

            {/* Live Video */}
            <div className="mb-4 overflow-hidden rounded-lg border-2 border-[#FF3B3B]/30">
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">

                <video
                  ref={setVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-[#FF3B3B] px-3 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                  <span className="text-white">LIVE</span>
                </div>
              </div>
            </div>

            {/* Audio waveform */}
            <div className="mb-4 rounded-lg border border-gray-800/50 bg-[#161B22] p-4">
              <p className="mb-2 text-gray-400">Audio Detection</p>
              <div className="flex items-end gap-1">
                {Array.from({ length: 44 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-full bg-[#FF3B3B]"
                    animate={{ height: [12, Math.random() * 48 + 8, 12] }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: i * 0.03,
                    }}
                    style={{ height: 12 }}
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <SmallStat label="Device ID" icon={User} value={alert.deviceId} />
              <SmallStat label="Location" icon={MapPin} value={alert.location} />
              <SmallStat
                label="Time"
                icon={Clock}
                value={getTimeAgo(alert.timestamp)}
              />
              <SmallStat label="Alert ID" icon={Radio} value={alert.id} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <Button
                onClick={onConfirm}
                className="flex-1 bg-[#1c5e37] py-6 text-white hover:bg-[#00a843]"
              >
                <CheckCircle className="mr-2 h-5 w-5 md:mr-1" />
                Confirm Real Alert
              </Button>

              <Button
                onClick={onDismiss}
                variant="outline"
                className="flex-1 border-gray-600 py-6 text-gray-900 hover:bg-gray-800 hover:text-white"
              >
                <XCircle className="mr-2 h-5 w-5 md:mr-1" />
                False Alert
              </Button>

              {/* <Button
                onClick={onTriggerSiren}
                className="flex-1 animate-pulse bg-[#FF3B3B] py-6 px-2 text-white hover:bg-[#dd2222]"
              >
                <Siren className="mr-2 h-5 w-5 md:mr-1" />
                Trigger Siren
              </Button> */} 
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function SmallStat({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800/50 bg-[#161B22] p-4">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );
}
