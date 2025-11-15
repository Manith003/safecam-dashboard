import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AlertPopup } from "@/components/AlertPopup";
import { type Alert, type AlertStatus } from "@/components/AlertCard";
import { toast } from "sonner";
import { Outlet } from "react-router-dom";
import { socket } from "./lib/socket";
import axios from "axios";

export default function App() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [popupAlert, setPopupAlert] = useState<Alert | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Simulate new alert
  useEffect(() => {
    socket.on("new_alert_broadcast", async (data) => {
      const newAlert: Alert = {
        ...data,
        timestamp: new Date(data.timestamp * 1000),
      };
      setAlerts((prev) => [newAlert, ...prev]);

      setPopupAlert(newAlert);
      setIsPopupOpen(true);
      toast.error("New Alert Detected!", {
        description: `${newAlert.deviceId} - ${newAlert.location}`,
      });
      try {
        await axios.post("http://localhost:3000/api/alert/new", {
          id: newAlert.id,
          deviceId: newAlert.deviceId,
          location: newAlert.location,
          latitude: newAlert.latitude,
          longitude: newAlert.longitude,
          status: "PENDING",
          timestamp: newAlert.timestamp,
        },{ withCredentials: true });
      } catch (err) {
        console.error("Failed to save alert:", err);
      }
    });

    return () => {
      socket.off("new_alert_broadcast");
    };
  }, []);

  useEffect(() => {
  async function loadAlerts() {
    try {
      const res = await axios.get("http://localhost:3000/api/alert/all");

      const dbAlerts = res.data.alerts.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));

      setAlerts(dbAlerts);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  }

  loadAlerts();
}, []);


  const handleConfirmAlert = async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "CONFIRMED" as AlertStatus }
          : alert
      )
    );
    if (popupAlert?.id === alertId) setIsPopupOpen(false);

    socket.emit("trigger_siren", { deviceId: popupAlert?.deviceId });
    toast.success("Alert Confirmed", {
      description: "The incident has been confirmed and logged.",
    });
    try {
      await axios.post("http://localhost:3000/api/alert/confirm", {
        id: alertId,
      },{ withCredentials: true });
    } catch (err) {
      console.error("Failed to confirm alert:", err);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "DISMISSED" as AlertStatus }
          : alert
      )
    );
    if (popupAlert?.id === alertId) setIsPopupOpen(false);

    toast.info("Alert Dismissed", {
      description: "The alert has been marked as false alarm.",
    });
    try {
      await axios.post("http://localhost:3000/api/alert/dismiss", { id: alertId },{ withCredentials: true });
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  };

  const handleTriggerSiren = () => {
    socket.emit("trigger_siren", { deviceId: popupAlert?.deviceId });
    toast.error("Siren Triggered!", {
      description: "Emergency siren has been activated at the location.",
    });

    if (popupAlert) handleConfirmAlert(popupAlert.id);
  };

  const handleAlertClick = (alert: Alert) => {
    setPopupAlert(alert);
    setIsPopupOpen(true);
  };

  return (
    <div className="h-screen bg-[#0A0E16] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet
            context={{
              alerts,
              onAlertClick: handleAlertClick,
              onConfirmAlert: handleConfirmAlert,
              onDismissAlert: handleDismissAlert,
            }}
          />
        </main>
      </div>

      <AlertPopup
        alert={popupAlert}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={() => popupAlert && handleConfirmAlert(popupAlert.id)}
        onDismiss={() => popupAlert && handleDismissAlert(popupAlert.id)}
        onTriggerSiren={handleTriggerSiren}
      />
    </div>
  );
}
