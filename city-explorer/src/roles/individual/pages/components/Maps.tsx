import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import Directions from "../components/Directions";
import PlacesAutocomplete from "./PlacesAutoComplete";

type Location = { lat: number; lng: number };

const DEFAULT_CENTER: Location = { lat: 9.0563, lng: 7.4985 };

const Maps: React.FC = () => {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
      <div className="h-screen w-full flex flex-col">
        {/* Header / Legend / Inputs */}
        <div className="shrink-0">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">
              Area markers and their colors
            </h2>
            <div className="ml-2 mt-3 space-y-1">
              <p className="text-sm">Police stations - Blue</p>
              <p className="text-sm">Fire stations - Red</p>
              <p className="text-sm">Post offices - Purple</p>
              <p className="text-sm">Government offices - Green</p>
              <p className="text-sm">Restaurants - Yellow</p>
            </div>
          </div>
          <div className="flex gap-4 p-8">
            <PlacesAutocomplete label="From..." onSelect={setOrigin} />
            <PlacesAutocomplete label="To..." onSelect={setDestination} />
          </div>
        </div>

        {/* Map fills remaining height */}
        <div className="grow min-h-[400px]">
          <Map
            defaultZoom={13}
            defaultCenter={DEFAULT_CENTER}
            mapId={import.meta.env.VITE_MAP_ID}
            fullscreenControl={false}
            className="h-full w-full"
          >
            {origin && <AdvancedMarker position={origin} />}
            {destination && <AdvancedMarker position={destination} />}
            {origin && destination && (
              <Directions origin={origin} destination={destination} />
            )}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

export default Maps;
