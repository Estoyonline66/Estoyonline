"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Define your location (latitude, longitude)
const position: [number, number] = [41.384867441618674, 2.16944012016164];

// Custom Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: "/svgs/locationIndicator.svg",
  iconSize: [0, 0],
  iconAnchor: [12, 41],
  className: "animate-pulse scale-125",
});

const MapComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Sunucuda render aşamasında hiçbir şey gösterme
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", zIndex: "0" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={customIcon}>
        <Popup>📍Estoyonline.es Office Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
