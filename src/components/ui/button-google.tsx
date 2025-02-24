import React from 'react';
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

// Define a proper interface for the props
interface GoogleAuthButtonProps {
  variant?: 'login' | 'register';
  isLoading?: boolean;
  onClick: (token: string) => void;
  disabled?: boolean;
  className?: string;
}

const GoogleAuthButton = ({ 
  variant = 'login', 
  isLoading = false,
  onClick,
  disabled = false,
  className = ""
}: GoogleAuthButtonProps) => {
  const handleGoogleAuth = async () => {
    try {
      console.log('Initiating Google auth...');
      
      // Load the Google API script if it's not already loaded
      if (!window.google) {
        await loadGoogleScript();
      }
      
      // Initialize Google auth client
      const auth2 = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: (response) => {
          if (response.access_token) {
            // Pass the ID token to the parent component
            onClick(response.credential);
          }
        },
        error_callback: (error) => {
          console.error('Google auth error:', error);
        },
        scope: 'email profile',
      });
      
      // Start the Google auth flow
      auth2.requestAccessToken();
      
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };
  
  // Helper function to load the Google API script
  const loadGoogleScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Skip if already loaded
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading || disabled}
      onClick={handleGoogleAuth}
      className={`flex items-center justify-center gap-3 border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary ${className}`}
    >
      <FaGoogle className="h-5 w-5" />
      {variant === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
    </Button>
  );
};

// Add the Google API types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            callback: (response: { access_token?: string; credential: string }) => void;
            error_callback: (error: unknown ) => void;
            scope: string;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export default GoogleAuthButton;