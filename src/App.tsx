import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/pages/Dashboard";
import { LiveCameras } from "@/components/pages/LiveCameras";
import { MapView } from "@/components/pages/MapView";
import { AlertsPage } from "@/components/pages/AlertsPage";
import { AlertPopup } from "@/components/AlertPopup";
import {type Alert, type AlertStatus } from "@/components/AlertCard";
import { toast } from "sonner";

const initialAlerts: Alert[] = [
  {
    id: "#A-12345",
    deviceId: "Pi-Unit-001",
    location: "Loyola College",
    timestamp: new Date(Date.now() - 10000),
    status: "PENDING",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: "#A-12344",
    deviceId: "Pi-Unit-003",
    location: "Anna Nagar Park",
    timestamp: new Date(Date.now() - 300000),
    status: "PENDING",
    latitude: 13.085,
    longitude: 80.2101,
  },
  {
    id: "#A-12343",
    deviceId: "Pi-Unit-002",
    location: "T. Nagar Bus Stand",
    timestamp: new Date(Date.now() - 7200000),
    status: "CONFIRMED",
    latitude: 13.0418,
    longitude: 80.2341,
  },
  {
    id: "#A-12342",
    deviceId: "Pi-Unit-005",
    location: "Marina Beach Entrance",
    timestamp: new Date(Date.now() - 14400000),
    status: "DISMISSED",
    latitude: 13.0499,
    longitude: 80.2824,
  },
  {
    id: "#A-12341",
    deviceId: "Pi-Unit-004",
    location: "Central Railway Station",
    timestamp: new Date(Date.now() - 86400000),
    status: "CONFIRMED",
    latitude: 13.0827,
    longitude: 80.275,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [popupAlert, setPopupAlert] = useState<Alert | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Simulate new alert (demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAlert: Alert = {
        id: `#A-${Math.floor(Math.random() * 10000)}`,
        deviceId: "Pi-Unit-001",
        location: "Loyola College",
        timestamp: new Date(),
        status: "PENDING",
        latitude: 13.0827,
        longitude: 80.2707,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      setPopupAlert(newAlert);
      setIsPopupOpen(true);

      toast.error("New Alert Detected!", {
        description: `${newAlert.deviceId} - ${newAlert.location}`,
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirmAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "CONFIRMED" as AlertStatus }
          : alert
      )
    );
    if (popupAlert?.id === alertId) setIsPopupOpen(false);

    toast.success("Alert Confirmed", {
      description: "The incident has been confirmed and logged.",
    });
  };

  const handleDismissAlert = (alertId: string) => {
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
  };

  const handleTriggerSiren = () => {
    toast.error("Siren Triggered!", {
      description: "Emergency siren has been activated at the location.",
    });

    if (popupAlert) handleConfirmAlert(popupAlert.id);
  };

  const handleAlertClick = (alert: Alert) => {
    setPopupAlert(alert);
    setIsPopupOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            alerts={alerts}
            onAlertClick={handleAlertClick}
            onConfirmAlert={handleConfirmAlert}
            onDismissAlert={handleDismissAlert}
          />
        );
      case "cameras":
        return <LiveCameras />;
      case "map":
        return <MapView />;
      case "alerts":
        return (
          <AlertsPage
            alerts={alerts}
            onConfirmAlert={handleConfirmAlert}
            onDismissAlert={handleDismissAlert}
          />
        );
      default:
        return (
          <Dashboard
            alerts={alerts}
            onAlertClick={handleAlertClick}
            onConfirmAlert={handleConfirmAlert}
            onDismissAlert={handleDismissAlert}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-[#0A0E16] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-hidden">{renderPage()}</main>
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
