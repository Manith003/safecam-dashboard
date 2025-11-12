import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const navigate = useNavigate();
  const [name, setname] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
     axios
      .get("http://localhost:3000/api/auth/user", { withCredentials: true })
      .then((res) => {
        setname(res.data.user.username);
      })
      .catch(() => {
        setname(null);
      });
  },[]);


  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    navigate("/");
    toast.success("Logout");
  };

  return (
    <nav className="border-b border-gray-800/50 bg-[#0F1218] px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#007BFF] to-[#0056b3]">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-white">SafeCam+</h1>
            <p className="text-gray-400 text-sm">Control Room</p>
          </div>
        </div>

        <div className="text-center">
          <div className="font-mono text-white text-lg">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-400 text-sm">{formatDate(currentTime)}</div>
        </div>

        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className={
              isOnline
                ? "border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
                : "border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
            }
          >
            <Circle
              className={
                "mr-2 h-2 w-2 " +
                (isOnline
                  ? "animate-pulse fill-[#00C853] text-[#00C853]"
                  : "fill-[#FF3B3B] text-[#FF3B3B]")
              }
            />
            {isOnline ? "System Online" : "System Offline"}
          </Badge>

          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border-2 border-[#007BFF]">
              <AvatarFallback className="bg-[#007BFF] text-white">
                {(name?.substring(0,2))?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left text-sm">
              <p className="text-white">{name}</p>
              <p className="text-gray-500">On Duty</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:bg-[#FF3B3B]/10 hover:text-[#FF3B3B]"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
