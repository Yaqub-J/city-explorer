import React, { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  origin: Location;
  destination: Location;
}

type Location = { lat: number; lng: number };

const Directions: React.FC<Props> = ({ origin, destination }) => {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");

  const [svc, setSvc] = useState<google.maps.DirectionsService | null>(null);
  const [renderer, setRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  const selected = routes[routeIndex];
  const leg = selected?.legs?.[0];

  useEffect(() => {
    if (!routesLib || !map) return;
    setSvc(new routesLib.DirectionsService());
    setRenderer(new routesLib.DirectionsRenderer({ map }));
  }, [routesLib, map]);

  useEffect(() => {
    if (!svc || !renderer) return;

    svc
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((res) => {
        renderer.setDirections(res);
        setRoutes(res.routes);
        setRouteIndex(0);
      })
      .catch((err) => console.error("Directions error:", err));
  }, [svc, renderer, origin, destination]);

  useEffect(() => {
    if (!renderer) return;
    renderer.setRouteIndex(routeIndex);
  }, [routeIndex, renderer]);

  if (!leg) return null;

  return (
    <div className="relative">
      <div className="absolute bottom-48 right-0 bg-gray-100 p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="text-lg font-semibold mb-2">{selected.summary}</h3>
        <p className="text-sm mb-1">
          {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
        </p>
        <p className="text-sm mb-1">Distance: {leg.distance?.text}</p>
        <p className="text-sm mb-4">Duration: {leg.duration?.text}</p>

        <h4 className="text-lg font-semibold mb-3">Available routes:</h4>
        <div className="space-y-2">
          {routes.map((r, i) => (
            <button
              key={`${r.summary}-${i}`}
              onClick={() => setRouteIndex(i)}
              className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                i === routeIndex
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {r.summary || `Route ${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Directions;
