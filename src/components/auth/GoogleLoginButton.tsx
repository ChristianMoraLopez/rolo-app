// Ejemplo de uso en componente de login
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import GoogleAuthButton from '@/components/ui/button-google';

const LoginPage = () => {
  const { isLoading, error, handleGoogleSuccess, handleGoogleError } = useGoogleAuth();

  return (
    <div className="flex flex-col gap-4">
      {/* Otros elementos de login */}
      
      <GoogleAuthButton 
        variant="login"
        isLoading={isLoading}
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default LoginPage;