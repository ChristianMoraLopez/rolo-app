// src/core/services/googleAuthService.ts
import { API_URL } from '@/config/api';
import { User } from '../entities/types';

interface AuthResponse {
  user: User;
  token: string;
}

export const googleAuthService = {
  /**
   * Autenticación con Google usando credencial JWT
   * @param credential El token JWT recibido de Google Sign-In
   * @param additionalData Datos adicionales opcionales del usuario
   * @returns Promise con usuario y token si es exitoso
   */
  async authenticate(credential: string, additionalData?: Record<string, unknown>): Promise<AuthResponse> {
    try {
      console.log("Enviando credential al servidor:", credential.substring(0, 20) + "...");
     
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credential, // Cambiado de token a credential
          authProvider: 'google',
          role: 'registered',
          ...additionalData
        })
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
   * Verificar autenticación actual por token en cookie
   * @returns Promise con usuario y token si hay sesión activa
   */
  async checkSession(): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies
      });
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error verificando sesión:", error);
      return null;
    }
  }
};