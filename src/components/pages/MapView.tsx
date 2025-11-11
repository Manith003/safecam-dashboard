import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Circle, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const alertLocations = [
  {
    id: "#A-12345",
    device: "Pi-Unit-001",
    location: "Loyola College",
    status: "CONFIRMED",
    lat: 13.062000,
    lng: 80.236313,
  }
];

export function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/base-v4/style.json?key=aF2DPrIyyg2RCw0mVnFZ",
        center: [80.2363, 13.062],
        zoom: 12,
      });

      // Add navigation controls (zoom/rotate)
      mapInstance.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );

      // Add alert markers
      alertLocations.forEach((alert) => {
        const markerColor = alert.status === "PENDING" ? "#FF3B3B" : "#00C853";

        const el = document.createElement("div");
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.background = markerColor;
        el.style.borderRadius = "50%";
        el.style.boxShadow = `0 0 10px ${markerColor}`;
        el.style.cursor = "pointer";

        const popupHtml = `
          <div style="font-family: sans-serif; color: white;">
            <strong>${alert.location}</strong><br/>
            Device: ${alert.device}<br/>
            Status: <span style="color:${markerColor}">${alert.status}</span><br/>
            Lat: ${alert.lat.toFixed(4)}, Lng: ${alert.lng.toFixed(4)}
          </div>
        `;

        new maplibregl.Marker(el)
          .setLngLat([alert.lng, alert.lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml))
          .addTo(mapInstance.current!);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLng = pos.coords.longitude;
            const userLat = pos.coords.latitude;
            new maplibregl.Marker({ color: "#007BFF" })
              .setLngLat([userLng, userLat])
              .setPopup(new maplibregl.Popup().setText("You are here"))
              .addTo(mapInstance.current!);
            mapInstance.current?.flyTo({
              center: [userLng, userLat],
              zoom: 13,
            });
          },
          () => console.log("Location access denied")
        );
      }
    }

    return () => mapInstance.current?.remove();
  }, []);

  return (
    <div className="h-full bg-neutral-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-white">Map View</h1>
          <p className="text-gray-400">
            Real-time alert locations across the network
          </p>
        </div>

        <div className="flex gap-3">
          <Badge
            variant="outline"
            className="border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
          >
            <Circle className="mr-2 h-2 w-2 fill-[#FF3B3B]" />
            {alertLocations.filter((a) => a.status === "PENDING").length} Pending
          </Badge>
          <Badge
            variant="outline"
            className="border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
          >
            <Circle className="mr-2 h-2 w-2 fill-[#00C853]" />
            {alertLocations.filter((a) => a.status === "CONFIRMED").length}{" "}
            Confirmed
          </Badge>
        </div>
      </div>

      <div
        className="grid grid-cols-4 gap-6"
        style={{ height: "calc(100% - 5rem)" }}
      >
        <div className="col-span-3">
          <Card className="h-full overflow-hidden border-gray-800/50 bg-[#161B22]">
            <div ref={mapContainer} className="h-full w-full" />
          </Card>
        </div>

        <div className="space-y-3 overflow-y-auto">
          <h3 className="text-white">Active Alerts</h3>
          {alertLocations.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={`border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218] p-4 ${
                  alert.status === "PENDING"
                    ? "border-l-4 border-l-[#FF3B3B]"
                    : "border-l-4 border-l-[#00C853]"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="text-white">{alert.device}</p>
                    <p className="text-gray-400">{alert.id}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      alert.status === "PENDING"
                        ? "border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
                        : "border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
                    }
                  >
                    {alert.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{alert.location}</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-gray-500">
                  <Radio className="h-4 w-4" />
                  <span>
                    Lat: {alert.lat.toFixed(4)}, Lng: {alert.lng.toFixed(4)}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}




// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Circle, Radio } from "lucide-react";
// import { motion } from "framer-motion";

// const alertLocations = [
//   {
//     id: "#A-12345",
//     device: "Pi-Unit-001",
//     location: "Loyola College",
//     status: "CONFIRMED",
//     lat: 13.062000,
//     lng: 80.236313,
//   }
// ];

// export function MapView() {

//   // const position = {
//   //   lat: 13.062000,
//   //   lng: 80.236313
//   // };

//   return (
//     <div className="h-full bg-neutral-800 p-6">
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h1 className="text-white">Map View</h1>
//           <p className="text-gray-400">
//             Real-time alert locations across the network
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Badge
//             variant="outline"
//             className="border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
//           >
//             <Circle className="mr-2 h-2 w-2 fill-[#FF3B3B]" />
//             {alertLocations.filter((a) => a.status === "PENDING").length}{" "}
//             Pending
//           </Badge>
//           <Badge
//             variant="outline"
//             className="border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
//           >
//             <Circle className="mr-2 h-2 w-2 fill-[#00C853]" />
//             {alertLocations.filter((a) => a.status === "CONFIRMED").length}{" "}
//             Confirmed
//           </Badge>
//         </div>
//       </div>

//       <div
//         className="grid grid-cols-4 gap-6"
//         style={{ height: "calc(100% - 5rem)" }}
//       >
//         <div className="col-span-3">
//           <Card className="h-full overflow-hidden border-gray-800/50 bg-[#161B22]">
//             <div className="relative h-full">
              
//               <iframe
//                 src={`https://www.openstreetmap.org/export/embed.html?bbox=80.1,13.0,80.35,13.15&layer=mapnik`}
//                 className="h-full w-full"
//                 style={{ border: 0 }}
//                 loading="lazy"
//               />
//               {alertLocations.map((alert, i) => (
//                 <motion.div
//                   key={alert.id}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: i * 0.15 }}
//                   className="absolute"
//                   style={{
//                     left: `${30 + i * 18}%`,
//                     top: `${40 + i * 8}%`,
//                   }}
//                 >
//                   <motion.div
//                     animate={{ scale: [1, 1.3, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className={`h-8 w-8 rounded-full ${
//                       alert.status === "PENDING"
//                         ? "bg-[#FF3B3B]"
//                         : "bg-[#00C853]"
//                     } shadow-lg`}
//                   >
//                     <MapPin className="h-8 w-8 text-white" />
//                   </motion.div>
//                 </motion.div>
//               ))}
//             </div>
//           </Card>
//         </div>

//         <div className="space-y-3 overflow-y-auto">
//           <h3 className="text-white">Active Alerts</h3>
//           {alertLocations.map((alert, i) => (
//             <motion.div
//               key={alert.id}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.08 }}
//             >
//               <Card
//                 className={`border-gray-800/50 bg-gradient-to-br from-[#161B22] to-[#0F1218] p-4 ${
//                   alert.status === "PENDING"
//                     ? "border-l-4 border-l-[#FF3B3B]"
//                     : "border-l-4 border-l-[#00C853]"
//                 }`}
//               >
//                 <div className="mb-2 flex items-start justify-between">
//                   <div>
//                     <p className="text-white">{alert.device}</p>
//                     <p className="text-gray-400">{alert.id}</p>
//                   </div>
//                   <Badge
//                     variant="outline"
//                     className={
//                       alert.status === "PENDING"
//                         ? "border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B]"
//                         : "border-[#00C853] bg-[#00C853]/10 text-[#00C853]"
//                     }
//                   >
//                     {alert.status}
//                   </Badge>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-400">
//                   <MapPin className="h-4 w-4" />
//                   <span>{alert.location}</span>
//                 </div>

//                 <div className="mt-3 flex items-center gap-2 text-gray-500">
//                   <Radio className="h-4 w-4" />
//                   <span>
//                     Lat: {alert.lat.toFixed(4)}, Lng: {alert.lng.toFixed(4)}
//                   </span>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
