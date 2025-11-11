import { type Alert } from "@/components/AlertCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Siren, XCircle, MapPin, Calendar, Hash, Radio } from "lucide-react";

interface AlertDetailsProps {
  alert: Alert | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function AlertDetails({
  alert,
  onConfirm,
  onDismiss,
}: AlertDetailsProps) {
  if (!alert) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Select an alert to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 overflow-y-auto px-6 py-6">
      {/* Video Feed */}
      <div className="space-y-3">
        <h2 className="text-white">Live Video Feed</h2>
        <Card className="overflow-hidden border-gray-800 bg-black">
          <div className="relative aspect-video bg-gray-900">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Radio className="h-12 w-12 animate-pulse text-[#FF3B3B]" />
              <p className="mt-2 text-gray-400">Live Stream Active</p>
              <p className="text-gray-500">{alert.deviceId}</p>
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-[#FF3B3B] px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="text-white">LIVE</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Buttons */}
      {alert.status === "PENDING" && (
        <div className="flex gap-4">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-[#D93025] py-6 text-white hover:bg-[#B71C1C]"
          >
            <Siren className="mr-2 h-5 w-5" />
            Confirm & Trigger Siren
          </Button>
          <Button
            onClick={onDismiss}
            variant="outline"
            className="flex-1 border-gray-600 py-6 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Dismiss
          </Button>
        </div>
      )}

      {/* Map */}
      <div className="space-y-3">
        <h2 className="text-white">Alert Location</h2>
        <Card className="overflow-hidden border-gray-800 bg-[#2A2A2A]">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              alert.longitude - 0.01
            },${alert.latitude - 0.01},${alert.longitude + 0.01},${
              alert.latitude + 0.01
            }&layer=mapnik&marker=${alert.latitude},${alert.longitude}`}
            className="h-64 w-full"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </Card>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <h2 className="text-white">Alert Information</h2>
        <Card className="border-gray-800 bg-[#2A2A2A] p-4 space-y-3">
          <Info label="Alert ID" icon={Hash} value={alert.id} />
          <Info label="Device ID" icon={Radio} value={alert.deviceId} />
          <Info
            label="Timestamp"
            icon={Calendar}
            value={alert.timestamp.toLocaleString()}
          />
          <Info label="Location" icon={MapPin} value={alert.location} />
          <div className="flex justify-between text-gray-400">
            <span>Status</span>
            <span className="text-white">{alert.status}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 pb-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="text-white">{value}</span>
    </div>
  );
}
