// src/components/features/LocationDetailMap.tsx
'use client';
import React from 'react';
import { 
  GoogleMap, 
  Marker, 
  useJsApiLoader,
  InfoWindow
} from '@react-google-maps/api';
import { AlertCircle } from 'lucide-react';
import { LocationType } from '@/core/entities/locationType';


interface LocationDetailMapProps {
  location: LocationType;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

export default function LocationDetailMap({ location }: LocationDetailMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const position = {
    lat: location.latitude,
    lng: location.longitude
  };

  // Manejo de errores de carga
  if (loadError) {
    console.error('Maps load error:', loadError);
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-600 p-4 rounded-lg">
        <AlertCircle className="mr-2" />
        Error cargando Google Maps. Verifica tu configuración.
      </div>
    );
  }

  // Estado de carga
  if (!isLoaded) {
    return (
      <div className="h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={position}
      zoom={15}
      options={{
        disableDefaultUI: true,
        scrollwheel: false
      }}
    >
      <Marker 
        position={position}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#1D4ED8", // Azul primario
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white"
        }}
      >
        {/* Información del marcador */}
        <InfoWindow position={position}>
          <div className="text-center p-2">
            <strong className="block mb-1">{location.name}</strong>
            <span className="text-sm text-muted-foreground">
              {location.sensations.join(', ')}
            </span>
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  );
}