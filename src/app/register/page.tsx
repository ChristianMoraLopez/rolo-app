//src\app\register\page.tsx

"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, AlertCircle, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import GoogleAuthButton from "@/components/ui/button-google";
import { useGoogleAuth } from '@/hooks/useGoogleAuth'; // Add this import
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register } = useAuth();
  const { handleGoogleAuth } = useGoogleAuth(); // Add this line to get handleGoogleAuth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // Pass additional data (like location) to the register function
      await register(email, password, name, { location });
      
      toast.success('Registro exitoso');
      // Redirigimos al home
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error en el registro. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsGoogleLoading(true);
    setError(null);
    
    try {
      // Use handleGoogleAuth directly from the hook
      await handleGoogleAuth(credential, { location });
      toast.success('Registro con Google exitoso');
      // The redirect will happen automatically through the useEffect in useGoogleAuth
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al registrarse con Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-moradoclaro/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent">
            Crear una cuenta
          </CardTitle>
          <CardDescription className="text-center text-foreground/60">
            Únete a Sensaciones Bogotá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Ubicación (opcional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-moradoclaro/20 w-full absolute"></div>
              <span className="bg-background px-2 z-10 text-sm text-foreground/60">
                O continúa con
              </span>
            </div>

            
          <GoogleAuthButton 
            variant="register" 
            isLoading={isGoogleLoading} 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading || isGoogleLoading}
            additionalData={{ location }}
            className="transition-all duration-300 hover:scale-105"
          />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-foreground/60">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="text-moradoprimary hover:text-moradohover transition-colors duration-300"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Error Dialog */}
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent className="bg-background border border-moradoclaro/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold text-rojoprimary">
              <AlertCircle className="h-6 w-6" />
              Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setError(null)}
              className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white"
            >
              Entendido
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}