// LoginPage.tsx 
"use client";

import React, { useState, useEffect } from 'react';
import GoogleAuthButton from "@/components/ui/button-google";
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
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use both hooks
  const { login, isAuthenticated } = useAuth();
  const { 
    isLoading: isGoogleLoading, 
    handleGoogleAuth
  } = useGoogleAuth();
  
  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/bogotanos');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the login method from useAuth
      await login(email, password);
      // No need to push to dashboard as the useEffect will handle redirection
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ha ocurrido un error durante el inicio de sesión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (token: string) => {
    try {
      await handleGoogleAuth(token);
      // Redirection will be handled by the useEffect
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión con Google');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-moradoclaro/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent">
            Bienvenido a Sensaciones Bogotá
          </CardTitle>
          <CardDescription className="text-center text-foreground/60">
            Ingresa para conectar con otros bogotanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
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
                  required
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-foreground/60">
            ¿Olvidaste tu contraseña?{' '}
            <Link
              href="/reset-password"
              className="text-moradoprimary hover:text-moradohover transition-colors duration-300"
            >
              Recupérala aquí
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-moradoclaro/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-foreground/60">O</span>
            </div>
          </div>

          <GoogleAuthButton 
            variant="login" 
            isLoading={isGoogleLoading} 
            onSuccess={handleGoogleLogin}
            onError={(err) => setError(err)}
            disabled={isLoading || isGoogleLoading}
            className="transition-all duration-300 hover:scale-105"
          />

          <Button
            variant="outline"
            asChild
            className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary transition-all duration-300"
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              Crear una cuenta nueva
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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