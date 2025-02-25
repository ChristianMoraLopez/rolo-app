// src/core/services/auth.ts
import { API_URL } from '@/config/api';
import { User } from '@/core/entities/types';


interface AuthResponse {
  user: User;
  token: string;
}

interface AdditionalData {
  authProvider?: string;
  role?: string;
  location?: string;
}


export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el inicio de sesión');
      }
      
      const data = await response.json();
      console.log('Datos de respuesta sin procesar:', data);
      
      // Asegúrate de que la respuesta tenga la estructura correcta
      if (!data.user || !data.token) {
        console.error('Respuesta incompleta del servidor:', data);
        throw new Error('La respuesta del servidor es incompleta');
      }
      
      // Registra la estructura de datos antes de devolverla
      console.log('Devolviendo datos estructurados:', {
        user: data.user,
        token: data.token ? 'Token presente' : 'Token ausente'
      });
      
      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  },

  getUserProfile: async (token: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener el perfil de usuario');
      }
      
      const data = await response.json();
      console.log('Datos de perfil recibidos:', data);
      
      // Asegurar que la respuesta contiene los datos de usuario necesarios
      if (!data.user) {
        console.error('Respuesta incompleta del servidor:', data);
        throw new Error('La respuesta del servidor no contiene los datos del usuario');
      }
      
      return data.user;
    } catch (error) {
      console.error('Error en authService.getUserProfile:', error);
      throw error;
    }
  },

 register: async (
    email: string,
    password: string,
    name: string,
    additionalData: AdditionalData = {}
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          authProvider: 'email',
          role: 'registered',
          ...additionalData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el registro');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en authService.register:', error);
      throw error;
    }
  },


  googleLogin: async (token: string, additionalData = {}): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token,
        authProvider: 'google',
        role: 'registered',
        ...additionalData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el inicio de sesión con Google');
    }

    return response.json();
  },
}

export const setUserCookie = (user: User) => {
  // Guardar en cookie y localStorage para mayor compatibilidad
  document.cookie = `currentUser=${JSON.stringify(user)}; path=/; max-age=86400`;
  localStorage.setItem('currentUser', JSON.stringify(user));
}

