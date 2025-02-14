// MapComponent.tsx
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, Marker, useMapEvents } = mod;
    
    return function Map({ position, setPosition }: {
      position: [number, number];
      setPosition: (pos: [number, number]) => void;
    }) {
      const LocationMarker = () => {
        const map = useMapEvents({
          click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            map.flyTo(e.latlng, map.getZoom());
          },
        });

        const markerIcon = divIcon({
          html: `<div class="flex items-center justify-center w-8 h-8 bg-verdeprimary rounded-full border-2 border-white shadow-lg">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
          className: 'custom-marker'
        });

        return position ? <Marker position={position} icon={markerIcon} /> : null;
      };

      return (
        <MapContainer
          center={position}
          zoom={11}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      );
    };
  }),
  { ssr: false }
);

export default MapComponent;