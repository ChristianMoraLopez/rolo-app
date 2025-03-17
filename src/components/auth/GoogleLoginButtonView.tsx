import React from 'react';
import {FaGoogle as GoogleIcon} from 'react-icons/fa';
import { Progress } from "@/components/ui/progress"


interface GoogleLoginButtonViewProps {
  onLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const GoogleLoginButtonView: React.FC<GoogleLoginButtonViewProps> = ({
  onLogin,
  isLoading,
  error
}) => {
  return (
    <div className="google-login-container">
      <button 
        onClick={onLogin} 
        disabled={isLoading}
        className={`
          flex items-center justify-center 
          w-full py-2 px-4 
          border border-gray-300 
          rounded-md shadow-sm 
          bg-white text-gray-700 
          hover:bg-gray-50
          transition-colors
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex items-center">
            <span className="mr-2">
                <Progress />
            </span>
            Iniciando sesión...
          </div>
        ) : (
          <>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Iniciar sesión con Google
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};