import { Home, Video, Bell, Map } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "cameras", label: "Live Cameras", icon: Video },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "map", label: "Map View", icon: Map },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-800/50 bg-[#0A0E16]">
      <div className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
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
