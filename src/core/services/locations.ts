import { API_URL } from '@/config/api';
import { LocationType } from '@/core/entities/locationType';

export const locationService = {
  // Obtener todas las locaciones
  getLocations: async (): Promise<LocationType[]> => {
    try {
      const response = await fetch(`${API_URL}/locations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error al obtener las locaciones');
      }
      return response.json();
    } catch (error) {
      console.error('Error en locationService.getLocations:', error);
      throw error;
    }
  },

  // Obtener una locación específica
  getLocation: async (id: string): Promise<LocationType> => {
    try {
      const response = await fetch(`${API_URL}/locations/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error al obtener la locación');
      }
      return response.json();
    } catch (error) {
      console.error('Error en locationService.getLocation:', error);
      throw error;
    }
  },

  // Crear una nueva locación
  createLocation: async (locationData: {
    name: string;
    description: string;
    images?: File[];
    sensations?: string[];
    smells?: string[];
    latitude: number;  // Make this required
    longitude: number; // Make this required
    address: string;
  }): Promise<LocationType> => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', locationData.name);
      formData.append('description', locationData.description);
      
      if (locationData.images && locationData.images.length > 0) {
        locationData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      if (locationData.sensations && locationData.sensations.length > 0) {
        formData.append('sensations', JSON.stringify(locationData.sensations));
      }
      
      if (locationData.smells && locationData.smells.length > 0) {
        formData.append('smells', JSON.stringify(locationData.smells));
      }
      
      if (locationData.latitude) {
        formData.append('latitude', locationData.latitude.toString());
      }
        if (locationData.longitude) {
            formData.append('longitude', locationData.longitude.toString());
        }
      
      const response = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la locación');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en locationService.createLocation:', error);
      throw error;
    }
  },

  // Actualizar una locación existente
  updateLocation: async (
    id: string,
    locationData: {
      name?: string;
      description?: string;
      images?: File[];
      sensations?: string[];
      smells?: string[];
      coordinates?: { lat: number; lng: number };
    }
  ): Promise<LocationType> => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (locationData.name) formData.append('name', locationData.name);
      if (locationData.description) formData.append('description', locationData.description);
      
      if (locationData.images && locationData.images.length > 0) {
        locationData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      if (locationData.sensations) {
        formData.append('sensations', JSON.stringify(locationData.sensations));
      }
      
      if (locationData.smells) {
        formData.append('smells', JSON.stringify(locationData.smells));
      }
      
      if (locationData.coordinates) {
        formData.append('coordinates', JSON.stringify(locationData.coordinates));
      }
      
      const response = await fetch(`${API_URL}/locations/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la locación');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en locationService.updateLocation:', error);
      throw error;
    }
  },

  // Eliminar una locación
  deleteLocation: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la locación');
      }
    } catch (error) {
      console.error('Error en locationService.deleteLocation:', error);
      throw error;
    }
  },

  // Comentar una locación
  commentLocation: async (locationId: string, content: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/locations/${locationId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Error al comentar la locación');
      }
    } catch (error) {
      console.error('Error en locationService.commentLocation:', error);
      throw error;
    }
  },
};