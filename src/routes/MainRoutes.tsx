import { Routes, Route } from "react-router-dom";
import App from "../App";
import { LoginPage } from "@/components/pages/LoginPage";
import { Dashboard } from "@/components/pages/Dashboard";
import { LiveCameras } from "@/components/pages/LiveCameras";
import { MapView } from "@/components/pages/MapView";
import { AlertsPage } from "@/components/pages/AlertsPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Dashboard />} />
        <Route path="livecamera" element={<LiveCameras />} />
        <Route path="map" element={<MapView />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
    </Routes>
  );
}
