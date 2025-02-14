"use client";

import { divIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export default function MapComponent({
  position,
  setPosition
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position ? (
      <Marker 
        position={position}
        icon={divIcon({
          html: `<div class="flex items-center justify-center w-8 h-8 bg-verdeprimary rounded-full border-2 border-white shadow-lg">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
          className: 'custom-marker'
        })}
      />
    ) : null;
  };

  return (
    <MapContainer
      center={[4.6097, -74.0817]}
      zoom={11}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
}