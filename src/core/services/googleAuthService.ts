// src/core/services/googleAuthService.ts
import { API_URL } from '@/config/api';
import { User } from '../entities/types';

interface AuthResponse {
  user: User;
  token: string;
}

export const googleAuthService = {
  /**
   * Login with Google credential token
   * @param credential The token received from Google Sign-In
   * @returns Promise with user and token if successful
   */
  async login(credential: string): Promise<AuthResponse> {
    try {
      console.log("Enviando credential al servidor:", credential.substring(0, 20) + "...");
      
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.message || 'Error en la autenticación con Google');
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error completo:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error en la conexión con el servidor');
    }
  },

  /**
   * Register with Google credential token
   * @param credential The token received from Google Sign-In
   * @param additionalData Optional additional user data
   * @returns Promise with user and token if successful
   */
  async register(credential: string, additionalData?: Record<string, unknown>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/google/`, { // Endpoint separado para registro
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential, // Cambiado para mantener consistencia
          ...additionalData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro con Google');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error en la conexión con el servidor');
    }
  },
};