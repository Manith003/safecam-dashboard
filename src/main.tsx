import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import MainRoutes from "./routes/MainRoutes.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <MainRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
  </>
);
