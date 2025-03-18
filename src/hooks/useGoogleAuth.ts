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
    const authResponse = await googleAuthService.authenticate(credential, additionalData);

    if (authResponse.user && authResponse.token) {
      console.log('Autenticación con Google exitosa:', {
        user: authResponse.user.email,
        tokenPresente: !!authResponse.token,
      });

      setUserData(authResponse.user, authResponse.token);
      toast.success('Autenticación con Google exitosa');

      // Redirigir al usuario
      router.push('/dashboard'); // Cambia '/dashboard' por la ruta correcta
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

    // Mostrar un mensaje amigable al usuario
    if (errorMessage.includes('Ya existe una cuenta con este correo electrónico')) {
      toast.error('Ya tienes una cuenta. Por favor, inicia sesión.');
      router.push('/login'); // Redirigir a la página de inicio de sesión
    } else {
      toast.error(errorMessage);
    }

    throw err;
  } finally {
    setIsLoading(false);
  }
}, [setUserData, router]);

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