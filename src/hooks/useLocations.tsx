import { useState, useEffect, useCallback } from 'react';
import { LocationType } from '@/core/entities/locationType';
import { locationService } from '@/core/services/locations';

interface UseLocationReturn {
    locations: LocationType[];
    currentLocation: LocationType | null;
    loading: boolean;
    error: Error | null;
    fetchLocations: () => Promise<void>;
    fetchLocationById: (id: string) => Promise<void>;
    createLocation: (locationData: {
      name: string;
      description: string;
      images?: File[];
      address: string; 
      sensations?: string[];
      smells?: string[];
      coordinates?: { lat: number; lng: number };
      latitude?: number;
      longitude?: number;
    }) => Promise<LocationType>;
    updateLocation: (
      id: string,
      locationData: {
        name?: string;
        description?: string;
        images?: File[];
        address: string; 
        sensations?: string[];
        smells?: string[];
        coordinates?: { lat: number; lng: number };
        latitude?: number;
        longitude?: number;
      }
    ) => Promise<LocationType>;
    deleteLocation: (id: string) => Promise<void>;
    commentLocation: (locationId: string, content: string) => Promise<void>;
  }

export const useLocation = (): UseLocationReturn => {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getLocations();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al obtener locaciones'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocationById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getLocation(id);
      setCurrentLocation(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al obtener la locación'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createLocation = useCallback(async (locationData: {
    name: string;
    description: string;
    images?: File[];
    address: string; 
    sensations?: string[];
    smells?: string[];
    coordinates?: { lat: number; lng: number };
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Explicitly handle coordinates
      const latitude = locationData.coordinates?.lat;
      const longitude = locationData.coordinates?.lng;
  
      if (latitude === undefined || longitude === undefined) {
        throw new Error('Location coordinates are required');
      }
  
      const processedLocationData = {
        ...locationData,
        latitude,  // Explicitly set latitude
        longitude, // Explicitly set longitude
      };
  
      // Remove the original coordinates object to prevent conflicts
      delete processedLocationData.coordinates;
    
      const newLocation = await locationService.createLocation(processedLocationData);
      setLocations(prev => [...prev, newLocation]);
      return newLocation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al crear la locación'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocation = useCallback(async (
    id: string,
    locationData: {
      name?: string;
      description?: string;
      images?: File[];
      address: string; 
      sensations?: string[];
      smells?: string[];
      coordinates?: { lat: number; lng: number };
      latitude?: number;
      longitude?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Transform coordinates if provided
      const processedLocationData = { ...locationData };
      
      if (locationData.coordinates) {
        processedLocationData.latitude = locationData.coordinates.lat;
        processedLocationData.longitude = locationData.coordinates.lng;
        delete processedLocationData.coordinates;
      }

      const updatedLocation = await locationService.updateLocation(id, processedLocationData);
      setLocations(prev => 
        prev.map(location => location._id === id ? updatedLocation : location)
      );
      if (currentLocation?._id === id) {
        setCurrentLocation(updatedLocation);
      }
      return updatedLocation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al actualizar la locación'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  const deleteLocation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await locationService.deleteLocation(id);
      setLocations(prev => prev.filter(location => location._id !== id));
      if (currentLocation?._id === id) {
        setCurrentLocation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al eliminar la locación'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  const commentLocation = useCallback(async (locationId: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      await locationService.commentLocation(locationId, content);
      // Si estamos viendo la locación actual, actualizamos sus datos para ver el nuevo comentario
      if (currentLocation?._id === locationId) {
        const updatedLocation = await locationService.getLocation(locationId);
        setCurrentLocation(updatedLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al comentar la locación'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  // Cargar locaciones al montar el componente
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    currentLocation,
    loading,
    error,
    fetchLocations,
    fetchLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    commentLocation,
  };
};