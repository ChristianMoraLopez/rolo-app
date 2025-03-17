// src/components/ui/button-google.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

interface GoogleAuthButtonProps {
  variant?: 'login' | 'register';
  isLoading?: boolean;
  onSuccess: (token: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

interface GoogleResponse {
  credential: string;
}


const GoogleAuthButton = ({
  variant = 'login',
  isLoading = false,
  onSuccess,
  onError,
  disabled = false,
  className = ""
}: GoogleAuthButtonProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Callback para manejar la respuesta de Google
  const handleGoogleResponse = useCallback((response: GoogleResponse | null) => {
    if (response?.credential) {
      console.log("Recibida credencial de Google:", response.credential.substring(0, 20) + "...");
      try {
        onSuccess(response.credential);
      } catch (callbackError) {
        console.error("Error al procesar credencial de Google:", callbackError);
        if (onError) onError(new Error("Error procesando la respuesta de Google"));
      }
    } else {
      console.error("Respuesta de Google no contiene credential:", response);
      if (onError) onError(new Error("No se recibió credential de Google"));
    }
  }, [onSuccess, onError]);
  

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
        if (onError) onError(new Error('No se pudo cargar la autenticación de Google'));
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
  }, [onError]);

  // Inicializar la API de Google cuando el script está cargado
  useEffect(() => {
    if (scriptLoaded && !isInitialized) {
      initializeGoogleAuth();
    }
  }, [scriptLoaded, isInitialized, handleGoogleResponse]);

  const initializeGoogleAuth = () => {
    if (!window.google?.accounts?.id) {
      console.error('API de Google no disponible');
      return;
    }
    
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!client_id) {
      console.error('No se encontró Google Client ID');
      if (onError) onError(new Error('Google Client ID no configurado'));
      return;
    }
  
    try {
      window.google.accounts.id.initialize({
        client_id,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Error inicializando Google Sign-In:', error);
      if (onError && error instanceof Error) onError(error);
    }
  };
  
  const handleGoogleAuth = () => {
    if (!window.google?.accounts?.id) {
      console.error('API de Google no cargada');
      if (onError) onError(new Error('API de Google no cargada'));
      return;
    }
    
    try {
      // Cancelar cualquier prompt anterior
      window.google.accounts.id.cancel();
      
      // Mostrar el prompt de Google
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.error('Google One Tap no se mostró:', notification.getNotDisplayedReason());
          if (onError) onError(new Error(`Google Sign-In no se mostró: ${notification.getNotDisplayedReason()}`));
        } else if (notification.isDismissedMoment()) {
          console.log('Google One Tap fue descartado:', notification.getDismissedReason());
          // No lanzar error aquí si fue descartado por el usuario
        }
      });
    } catch (error) {
      console.error('Error en Google prompt:', error);
      if (onError && error instanceof Error) onError(error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading || disabled || !scriptLoaded || !isInitialized}
      onClick={handleGoogleAuth}
      className={`flex items-center justify-center gap-3 border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary ${className}`}
    >
      <FaGoogle className="h-5 w-5" />
      {variant === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
    </Button>
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