"use client";

import React, { useCallback, useRef, useState } from 'react';
import { 
  GoogleMap, 
  Marker, 
  useJsApiLoader, 
  StandaloneSearchBox,
  Libraries
} from '@react-google-maps/api';
import { AlertCircle } from 'lucide-react';

// Tipos de posición
type Position = { lat: number; lng: number } | [number, number];

// Propiedades del componente
interface MapComponentProps {
  position: Position | null;
  setPosition: (pos: Position) => void;
  address?: string;
  setAddress: (address: string) => void;
}

// Estilos del contenedor del mapa
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

// Centro por defecto (Bogotá)
const defaultCenter = {
  lat: 4.7110,
  lng: -74.0721
};

// Bibliotecas de Google Maps
const libraries: Libraries = ['places'];

export default function MapComponent({ 
  position, 
  setPosition, 
  address = '', 
  setAddress 
}: MapComponentProps) {
  // Cargar API de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Referencias para el mapa y la búsqueda
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [searchInput, setSearchInput] = useState(address);

  // Normalizar la posición
  const normalizePosition = (pos: Position): { lat: number; lng: number } => 
    Array.isArray(pos) ? { lat: pos[0], lng: pos[1] } : pos;

  // Manejar selección de lugar
  const handlePlaceSelect = useCallback(() => {
    const searchBox = searchBoxRef.current;
    const map = mapRef.current;

    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const location = place.geometry?.location;
        
        if (location) {
          const lat = location.lat();
          const lng = location.lng();
          
          // Actualizar posición
          setPosition([lat, lng]);

          // Actualizar dirección
          const formattedAddress = place.formatted_address || searchInput;
          setAddress(formattedAddress);
          setSearchInput(formattedAddress);

          // Centrar y hacer zoom
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
          }
        }
      }
    }
  }, [setPosition, setAddress, searchInput]);

  // Manejar clic en el mapa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const map = mapRef.current;

    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Actualizar posición
      setPosition([lat, lng]);

      // Geocodificar
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          setSearchInput(formattedAddress);
        }
      });

      // Centrar mapa
      if (map) {
        map.panTo({ lat, lng });
      }
    }
  }, [setPosition, setAddress]);

  // Manejar cambio manual en el input de búsqueda
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Manejo de errores de carga
  if (loadError) {
    console.error('Maps load error:', loadError);
    return (
      <div className="flex items-center justify-center h-[300px] bg-red-50 text-red-600 p-4 rounded-lg">
        <AlertCircle className="mr-2" />
        Error cargando Google Maps. Verifica tu configuración.
      </div>
    );
  }

  // Estado de carga
  if (!isLoaded) {
    return (
      <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  // Posición normalizada
  const normalizedPosition = position ? normalizePosition(position) : null;

  return (
    <div className="relative">
      <div className="mb-2 w-full">
        <StandaloneSearchBox
          onLoad={(ref) => {
            searchBoxRef.current = ref;
          }}
          onPlacesChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Buscar dirección"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => {
              // Prevent form submission on Enter
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </StandaloneSearchBox>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={normalizedPosition || defaultCenter}
        zoom={normalizedPosition ? 15 : 11}
        onClick={handleMapClick}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {normalizedPosition && (
          <Marker 
            position={normalizedPosition}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#22C55E",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white"
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}