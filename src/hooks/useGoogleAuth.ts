// hooks/useGoogleAuth.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { googleAuthService } from '@/core/services/googleAuthService';
import { useAuth } from './useAuth';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUserData } = useAuth(); // Obtén la función setUserData del contexto de Auth

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    if (!credential) {
      toast.error('No se recibió credencial de Google');
      return;
    }
   
    setIsLoading(true);
    setError(null);
    console.log("Credential recibido:", credential.substring(0, 20) + "...");
   
    try {
      // Enviar el credential (ID token) de Google al backend para autenticación
      const authResponse = await googleAuthService.login(credential);
     
      if (authResponse.user && authResponse.token) {
        // Usar la función centralizada de AuthContext para guardar datos consistentemente
        setUserData(authResponse.user, authResponse.token);
       
        toast.success('Inicio de sesión con Google exitoso');
        router.push('/bogotanos');
        return authResponse;
      } else {
        throw new Error('Respuesta de autenticación incompleta');
      }
    } catch (err) {
      handleGoogleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUserData]);

  const handleGoogleError = useCallback((err: Error) => {
    handleGoogleAuthError(err);
  }, []);

  const handleGoogleAuthError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error
      ? err.message
      : 'Error en la autenticación con Google';
   
    console.error('Error en autenticación Google:', err);
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  // Función para registro con Google
  const handleGoogleRegister = useCallback(async (credential: string, additionalData?: Record<string, unknown>) => {
    if (!credential) {
      toast.error('No se recibió credencial de Google');
      return;
    }
   
    setIsLoading(true);
    setError(null);
   
    try {
      // Enviar el credential a la API de registro
      const authResponse = await googleAuthService.register(credential, additionalData);
     
      if (authResponse.user && authResponse.token) {
        // Usar la función centralizada de AuthContext
        setUserData(authResponse.user, authResponse.token);
       
        toast.success('Registro con Google exitoso');
        router.push('/dashboard');
        return authResponse;
      } else {
        throw new Error('Respuesta de registro incompleta');
      }
    } catch (err) {
      handleGoogleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUserData]);

  // Método unificado para limpiar el estado de autenticación
  const resetGoogleAuthState = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    handleGoogleSuccess,
    handleGoogleError,
    handleGoogleRegister,
    resetGoogleAuthState
  };
};