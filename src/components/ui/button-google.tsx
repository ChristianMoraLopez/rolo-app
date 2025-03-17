import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

interface GoogleAuthButtonProps {
  variant?: 'login' | 'register';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  additionalData?: Record<string, unknown>;
}

interface GoogleResponse {
  credential: string;
}

const GoogleAuthButton = ({
  variant = 'login',
  isLoading: externalLoading = false,
  disabled = false,
  className = "",
  additionalData = {}
}: GoogleAuthButtonProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  
  // Usar el hook unificado de autenticación con Google
  const { handleGoogleAuth, isLoading: authLoading, error } = useGoogleAuth();
  
  // Combinar estado de carga externo e interno
  const isLoading = externalLoading || authLoading;

  // Callback para manejar la respuesta de Google
  const handleGoogleResponse = useCallback((response: GoogleResponse | null) => {
    if (response?.credential) {
      console.log("Recibida credencial de Google:", response.credential.substring(0, 20) + "...");
      try {
        // Usar el método unificado de autenticación
        handleGoogleAuth(response.credential, additionalData);
      } catch (callbackError) {
        console.error("Error al procesar credencial de Google:", callbackError);
      }
    } else {
      console.error("Respuesta de Google no contiene credential:", response);
    }
  }, [handleGoogleAuth, additionalData]);

  // Cargar el script de Google
  useEffect(() => {
    const loadGoogleScript = () => {
      // Verificar si ya está cargado
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        setScriptLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Error cargando el script de Google API:', error);
        redirectToGoogleAuth(); // Si falla la carga del script, redirigir directamente
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
    
    // Limpieza al desmontar
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  // Inicializar la API de Google cuando el script está cargado
  useEffect(() => {
    if (scriptLoaded && !isInitialized) {
      initializeGoogleAuth();
    }
  }, [scriptLoaded, isInitialized]);

  // Renderizar botón de Google cuando el componente está montado
  useEffect(() => {
    if (isInitialized && googleButtonRef.current) {
      renderGoogleButton();
    }
  }, [isInitialized]);

  const renderGoogleButton = useCallback(() => {
    if (!window.google?.accounts?.id || !googleButtonRef.current) return;
    
    try {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: variant === 'login' ? 'continue_with' : 'signup_with',
        shape: 'rectangular',
        width: googleButtonRef.current.clientWidth || undefined
      });
    } catch (error) {
      console.error('Error al renderizar botón de Google:', error);
      redirectToGoogleAuth(); // Si falla el renderizado, redirigir
    }
  }, [variant]);

  const initializeGoogleAuth = useCallback(() => {
    if (!window.google?.accounts?.id) {
      console.error('API de Google no disponible');
      redirectToGoogleAuth(); // Si la API no está disponible, redirigir
      return;
    }
    
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!client_id) {
      console.error('No se encontró Google Client ID');
      return;
    }
  
    try {
      // Inicializar la API de Google
      window.google.accounts.id.initialize({
        client_id,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      setIsInitialized(true);
      
      // Intentar mostrar One Tap (pero no usar popup como fallback)
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error inicializando Google Sign-In:', error);
      redirectToGoogleAuth(); // Si falla la inicialización, redirigir
    }
  }, [handleGoogleResponse]);
  
  // Función para redirección directa a Google Auth (sin popup)
  const redirectToGoogleAuth = () => {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!client_id) {
      console.error('No se encontró Google Client ID');
      return;
    }
    
    // Guardar la URL actual para redirigir de vuelta después de la autenticación
    const currentPath = encodeURIComponent(window.location.pathname);
    sessionStorage.setItem('googleAuthRedirect', currentPath);
    
    // Crear la URL de autenticación de Google
    const redirect_uri = encodeURIComponent(`${window.location.origin}/api/auth/google-callback`);
    const scope = encodeURIComponent('profile email');
    const response_type = 'code'; // Usar 'code' en lugar de 'token' para el flujo seguro
    const state = currentPath; // Pasar la ruta actual como state para recuperarla después
    
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&state=${state}`;
    
    // Redirigir a Google Auth
    window.location.href = authUrl;
  };

  // Manejar clic en el contenedor cuando falla el botón de Google
  const handleContainerClick = () => {
    if (!isInitialized || !window.google?.accounts?.id) {
      redirectToGoogleAuth();
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div 
        ref={googleButtonRef}
        onClick={handleContainerClick}
        className={`w-full min-h-10 ${isLoading || disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      />
      {!scriptLoaded && (
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || disabled}
          onClick={redirectToGoogleAuth}
          className={`flex items-center justify-center gap-3 w-full border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary mt-2 ${className}`}
        >
          <FaGoogle className="h-5 w-5" />
          {variant === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
        </Button>
      )}
    </div>
  );
};

// Tipos para la API de Google
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
            context?: string;
          }) => void;
          prompt: (callback?: (notification: {
            isDisplayed: () => boolean;
            isNotDisplayed: () => boolean;
            getNotDisplayedReason: () => string;
            isSkippedMoment: () => boolean;
            getSkippedReason: () => string;
            isDismissedMoment: () => boolean;
            getDismissedReason: () => string;
          }) => void) => void;
          renderButton: (element: HTMLElement, options: object) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export default GoogleAuthButton;