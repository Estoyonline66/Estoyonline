"use client"; 

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Define your location (latitude, longitude)
const position: [number, number] = [6.5244, 3.3792]; // Example: Lagos, Nigeria

// Custom Leaflet marker icon (to avoid missing marker issue)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which corresponds to marker location
});

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "400px", width: "100%", zIndex: "0" }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Marker with Popup */}
      <Marker position={position} icon={customIcon}>
        <Popup>📍 Office Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
