import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/user", { withCredentials: true })
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">Checking auth...</div>;

  if (!authenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}
