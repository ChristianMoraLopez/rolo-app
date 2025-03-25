// src/components/features/Map.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  GoogleMap, 
  Marker, 
  InfoWindow,
  useJsApiLoader 
} from '@react-google-maps/api';
import { useLocation } from '@/hooks/useLocations';
import { LocationType } from '@/core/entities/locationType';
import { AlertCircle } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 4.6097,
  lng: -74.0817
};

export default function Map() {
  const { locations, loading, error } = useLocation();
  const [mapLocations, setMapLocations] = useState<LocationType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  useEffect(() => {
    if (locations && locations.length > 0) {
      setMapLocations(locations);
    }
  }, [locations]);

  // Manejo de errores de carga de Google Maps
  if (loadError) {
    console.error('Maps load error:', loadError);
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-600 p-4 rounded-lg">
        <AlertCircle className="mr-2" />
        Error cargando Google Maps. Verifica tu configuración.
      </div>
    );
  }

  // Estado de carga de Google Maps
  if (!isLoaded) {
    return (
      <div className="h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  // Estado de carga de locaciones
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Cargando ubicaciones...
      </div>
    );
  }

  // Error de locaciones
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error al cargar ubicaciones: {error.message}
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
    >
      {mapLocations.map((location) => (
        <Marker 
          key={location._id}
          position={{
            lat: location.latitude,
            lng: location.longitude
          }}
          onClick={() => setSelectedLocation(location)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#1D4ED8", // Azul primario
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white"
          }}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="p-2">
            <h3 className="font-bold mb-1">{selectedLocation.name}</h3>
            <p className="text-sm text-gray-600">{selectedLocation.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              {selectedLocation.sensations && selectedLocation.sensations.length > 0 && (
                <p>Sensaciones: {selectedLocation.sensations.join(', ')}</p>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}