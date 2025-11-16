import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { usePiWebRTC } from "@/hooks/usePiWebRTC";

const camera = {
  id: "Pi-Unit-001",
  location: "Loyola College",
  status: "online",
  lat: 13.0827,
  lng: 80.2707,
};

export function LiveCameras() {
  const { videoRef } = usePiWebRTC(camera.id);
  return (
    <div className="h-full overflow-y-auto bg-neutral-800 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-white">Live Camera</h1>
          <p className="text-gray-400">Single camera monitoring system</p>
        </div>
        <Badge
          variant="outline"
          className="border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
        >
          <Circle className="mr-2 h-2 w-2 animate-pulse fill-[#00C853]" />
          System Operational
        </Badge>
      </div>

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl"
        >
          <Card className="overflow-hidden border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218]">
            <div className="relative aspect-video bg-gray-900">
              <video
                ref={videoRef}
                className="object-cover w-full h-full bg-black"
                autoPlay
                playsInline
                muted={true}
              />

              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-green-700 px-4 py-2">
                <Circle className="h-2 w-2 animate-pulse fill-white" />
                <span className="text-white">Online</span>
              </div>

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-[#FF3B3B] px-3 py-2">
                <Circle className="h-2 w-2 animate-pulse fill-white" />
                <span className="text-white">LIVE</span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-white">{camera.id}</h2>
                <Badge
                  variant="outline"
                  className="border-[#007BFF] bg-[#007BFF]/10 text-[#007BFF]"
                >
                  Active
                </Badge>
              </div>

              <div className="mb-4 flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>{camera.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4 md:grid-cols-4">
                <div>
                  <p className="text-gray-500">Resolution</p>
                  <p className="mt-1 text-white">1080p</p>
                </div>
                <div>
                  <p className="text-gray-500">FPS</p>
                  <p className="mt-1 text-white">30</p>
                </div>
                <div>
                  <p className="text-gray-500">Latitude</p>
                  <p className="mt-1 text-white">{camera.lat.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Longitude</p>
                  <p className="mt-1 text-white">{camera.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

