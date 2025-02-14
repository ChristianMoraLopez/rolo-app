// src/components/features/LocationDetailMap.tsx
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from '@/core/entities/types';


interface LocationDetailMapProps {
  location: Location;
}

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

export default function LocationDetailMap({ location }: LocationDetailMapProps) {
  const position: [number, number] = [location.latitude, location.longitude];

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={position} icon={CustomMarker}>
        <Popup>
          <div className="text-center">
            <strong className="block mb-1">{location.name}</strong>
            <span className="text-sm text-muted-foreground">
              {location.sensations.join(', ')}
            </span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}