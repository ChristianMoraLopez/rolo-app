
// src/components/features/Map.tsx
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockLocations } from '@/infrastructure/mocks/data';
import L from 'leaflet';

// Corregir el ícono del marcador

const CustomMarker = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-azulprimary">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>`,
  className: 'custom-marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export default function Map() {
  const bogotaCenter = [4.6097, -74.0817];

  return (
    <MapContainer 
      center = {bogotaCenter as L.LatLngTuple} 
      zoom={12} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {mockLocations.map((location) => (
        <Marker 
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={CustomMarker}
        >
          <Popup>
            <strong>{location.name}</strong>
            <p>{location.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}