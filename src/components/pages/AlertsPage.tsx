import { useOutletContext } from "react-router-dom";
import { type Alert } from "@/components/AlertCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  XCircle,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";

interface AlertsPageContext {
  alerts: Alert[];
  onConfirmAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

export function AlertsPage() {
  const { alerts, onConfirmAlert, onDismissAlert } =
    useOutletContext<AlertsPageContext>();

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const pendingAlerts = alerts.filter((a) => a.status === "PENDING");
  const confirmedAlerts = alerts.filter((a) => a.status === "CONFIRMED");
  const dismissedAlerts = alerts.filter((a) => a.status === "DISMISSED");

  const AlertList = ({ alertList }: { alertList: Alert[] }) => (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 pr-4">
        {alertList.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218] p-4 ${
                alert.status === "PENDING"
                  ? "border-l-4 border-l-[#FF3B3B]"
                  : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                  <div className="flex h-full items-center justify-center">
                    <Camera className="h-10 w-10 text-gray-600" />
                  </div>
                  {alert.status === "PENDING" && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-[#FF3B3B] px-2 py-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></div>
                      <span className="text-white">LIVE</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-white">{alert.deviceId}</h3>
                      <p className="text-gray-400">{alert.id}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        alert.status === "PENDING"
                          ? "border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
                          : alert.status === "CONFIRMED"
                          ? "border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
                          : "border-gray-600 bg-gray-800 text-gray-400"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Radio className="h-4 w-4" />
                      <span>
                        Lat: {alert.latitude.toFixed(4)}, Lng:{" "}
                        {alert.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {alert.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onConfirmAlert(alert.id)}
                        className="bg-[#00C853] text-white hover:bg-[#00a843]"
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDismissAlert(alert.id)}
                        className="border-gray-600 text-gray-400 hover:bg-gray-800"
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="h-full overflow-hidden bg-neutral-800 p-6">
      <div className="mb-2">
        <h1 className="text-white">Alerts Management</h1>
        <p className="text-gray-400">Review and manage all system alerts</p>
      </div>

      <Tabs defaultValue="all" className="h-[calc(100%-5rem)]">
        <TabsList className="bg-[#161B22]">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
          >
            All Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-[#FF3B3B] data-[state=active]:text-white"
          >
            Pending ({pendingAlerts.length})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white"
          >
            Confirmed ({confirmedAlerts.length})
          </TabsTrigger>
          <TabsTrigger
            value="dismissed"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
          >
            Dismissed ({dismissedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AlertList alertList={alerts} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <AlertList alertList={pendingAlerts} />
        </TabsContent>
        <TabsContent value="confirmed" className="mt-6">
          <AlertList alertList={confirmedAlerts} />
        </TabsContent>
        <TabsContent value="dismissed" className="mt-6">
          <AlertList alertList={dismissedAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
