// hooks/useGoogleAuth.ts 
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { googleAuthService } from '@/core/services/googleAuthService';
import { useAuth } from './useAuth';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUserData, isAuthenticated } = useAuth();

  // Efecto para manejar la redirección cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Usuario autenticado, redirigiendo...');
      router.push('/bogotanos');
    }
  }, [isAuthenticated, isLoading, router]);

  // Método unificado para autenticar con Google (login o registro en un solo paso)
  const handleGoogleAuth = useCallback(async (credential: string, additionalData?: Record<string, unknown>) => {
    if (!credential) {
      toast.error('No se recibió credencial de Google');
      return;
    }
   
    setIsLoading(true);
    setError(null);
    console.log("Credential recibido:", credential.substring(0, 20) + "...");
   
    try {
      // Usar un único método que maneja tanto login como registro
      const authResponse = await googleAuthService.authenticate(credential, additionalData);
     
      if (authResponse.user && authResponse.token) {
        console.log('Autenticación con Google exitosa:', {
          user: authResponse.user.email,
          tokenPresente: !!authResponse.token
        });
        
        // Usar la función centralizada de AuthContext para guardar datos
        setUserData(authResponse.user, authResponse.token);
        
        toast.success('Autenticación con Google exitosa');
        
        // La redirección se hará en el useEffect
        return authResponse;
      } else {
        throw new Error('Respuesta de autenticación incompleta');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error en la autenticación con Google';
      
      console.error('Error en autenticación Google:', err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUserData]);

  // Método para limpiar el estado de autenticación
  const resetAuthState = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    handleGoogleAuth,
    resetAuthState,
    isAuthenticated 
  };
};