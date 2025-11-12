import { Home, Video, Bell, Map } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "livecamera", label: "Live Cameras", icon: Video, path: "/livecamera" },
  { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
  { id: "map", label: "Map View", icon: Map, path: "/map" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-64 border-r border-gray-800/50 bg-[#0A0E16]">
      <div className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative w-full rounded-lg px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-[#007BFF]/20 text-[#007BFF]"
                  : "text-gray-400 hover:bg-[#161B22] hover:text-white"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg border-2 border-[#007BFF]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
