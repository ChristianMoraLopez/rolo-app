// src/core/services/auth.ts
import { API_URL } from '@/config/api';
import { User } from '@/core/entities/types';


interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
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
    console.log('Raw response data:', data); // Para depuración
    return data;
  },

  register: async (email: string, password: string, name: string, additionalData = {}): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password, 
        name,
        authProvider: 'email',
        role: 'registered',
        ...additionalData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    return response.json();
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

