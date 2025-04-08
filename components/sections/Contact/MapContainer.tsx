"use client"; 

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Define your location (latitude, longitude)
const position: [number, number] = [41.384867441618674, 2.16944012016164]; // coordinate according to the originial website

// Custom Leaflet marker icon (to avoid missing marker issue)
const customIcon = new L.Icon({
  iconUrl: "/svgs/locationIndicator.svg",
  iconSize: [50, 60], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which corresponds to marker location
  className:"animate-pulse scale-125",
  
});

const MapComponent = () => {
  return (
    <MapContainer  center={position} zoom={13} scrollWheelZoom={false} style={{ height: "400px", width: "100%", zIndex: "0" }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Marker with Popup */}
      <Marker position={position} icon={customIcon}>
        <Popup>📍Estoyonline.es Office Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
