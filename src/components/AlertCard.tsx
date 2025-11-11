import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

export type AlertStatus = "PENDING" | "CONFIRMED" | "DISMISSED";

export interface Alert {
  id: string;
  deviceId: string;
  location: string;
  timestamp: Date;
  status: AlertStatus;
  latitude: number;
  longitude: number;
  videoUrl?: string;
}

interface AlertCardProps {
  alert: Alert;
  isSelected: boolean;
  onClick: () => void;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function AlertCard({ alert, isSelected, onClick }: AlertCardProps) {
  const statusColor =
    alert.status === "PENDING"
      ? "text-[#FF3B3B]"
      : alert.status === "CONFIRMED"
      ? "text-[#00C853]"
      : "text-gray-400";

  const selectedRing = isSelected ? "ring-2 ring-[#007BFF]/50" : "";

  return (
    <Card
      className={`cursor-pointer border border-gray-800 bg-[#161B22] hover:border-[#007BFF]/40 p-4 ${selectedRing}`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <span className="text-white">{alert.deviceId}</span>
          <span className={`${statusColor}`}>{alert.status}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{alert.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{getTimeAgo(alert.timestamp)}</span>
        </div>
      </div>
    </Card>
  );
}
