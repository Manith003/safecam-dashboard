import { useOutletContext } from "react-router-dom";
import { type Alert } from "@/components/AlertCard";
import { StatsCard } from "@/components/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Video,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Circle,
  Camera,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePiWebRTC } from "@/hooks/usePiWebRTC";

interface DashboardContext {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onConfirmAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

export function Dashboard() {
  const { alerts, onAlertClick, onConfirmAlert, onDismissAlert } =
    useOutletContext<DashboardContext>();
    
  const { stream } = usePiWebRTC("Pi-Unit-001");

  const pendingAlerts = alerts.filter((a) => a.status === "PENDING");
  const confirmedToday = alerts.filter(
    (a) =>
      a.status === "CONFIRMED" &&
      new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="h-full overflow-y-auto bg-neutral-800 p-6">
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatsCard
          icon={Video}
          label="Active Cameras"
          value={1}
          color="#007BFF"
        />
        <StatsCard
          icon={Bell}
          label="Alerts Today"
          value={pendingAlerts.length}
          color="#FF3B3B"
        />
        <StatsCard
          icon={CheckCircle}
          label="Confirmed Incidents"
          value={confirmedToday}
          color="#00C853"
        />
        <StatsCard
          icon={Clock}
          label="Pending Reviews"
          value={pendingAlerts.length}
          color="#FFA726"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between pr-5">
            <h2 className="text-white">Real-time Alerts Feed</h2>
            <div className="flex items-center gap-2 text-[#22c55e]">
              <Circle className="h-2 w-2 animate-pulse fill-[#22c55e]" />
              <span>Live</span>
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3 pr-4">
              {alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Card
                    className={`border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218] p-4 transition-all hover:border-[#007BFF]/50 ${
                      alert.status === "PENDING"
                        ? "border-l-4 border-l-[#990606]"
                        : ""
                    }`}
                    onClick={() => onAlertClick(alert)}
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                        <div className="flex h-full items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-600" />
                        </div>
                        {alert.status === "PENDING" && (
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-[#FF3B3B] px-1 py-0.5">
                            <Circle className="h-2.5 w-2.5 animate-pulse fill-white" />
                            <span className="text-white">LIVE</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="text-white">{alert.deviceId}</p>
                            <div className="mt-1 flex items-center gap-2 text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{alert.location}</span>
                            </div>
                          </div>
                          <span
                            className={`rounded px-2 py-1 ${
                              alert.status === "PENDING"
                                ? "bg-[#FF3B3B]/20 text-[#FF3B3B]"
                                : alert.status === "CONFIRMED"
                                ? "bg-[#00C853]/20 text-[#0df76eea]"
                                : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(alert.timestamp)}</span>
                          </div>

                          {alert.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onConfirmAlert(alert.id);
                                }}
                                className="bg-green-800 text-white hover:bg-[#00a843]"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismissAlert(alert.id);
                                }}
                                className="border-gray-600 text-gray-900 hover:bg-gray-800 hover:text-white"
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6 w-[100%]">
            <h2 className="mb-3 text-white">Alert Locations</h2>
            <Card className="overflow-hidden border-gray-800/50 bg-[#161B22]">
              <div className="relative h-64">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=80.1,13.0,80.35,13.15&layer=mapnik`}
                  className="h-full w-full"
                  style={{ border: 2 }}
                  loading="lazy"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-6 w-6 rounded-full bg-[#FF3B3B]"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-white">Live Camera Preview</h2>

          <Card className="border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-white">Pi-Unit-001</h3>
              <div className="flex items-center gap-2 rounded-full bg-[#00C853] px-3 py-1">
                <Circle className="h-2 w-2 animate-pulse fill-white" />
                <span className="text-white">Online</span>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
              <div className="flex h-full items-center justify-center">
                <video
                  ref={(el) => {
                    if (el && stream) el.srcObject = stream;
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-[#FF3B3B] px-2 py-1">
                <Circle className="h-1.5 w-1.5 animate-pulse fill-white" />
                <span className="text-white">LIVE</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Location</span>
                <span className="text-white">Loyola College</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Device ID</span>
                <span className="text-white">Pi-Unit-001</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Resolution</span>
                <span className="text-white">240p</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">FPS</span>
                <span className="text-white">12</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
