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
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { mockUsers } from '@/infrastructure/mocks/data';
import { toast } from "sonner";

interface LoginError {
  title: string;
  message: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Iniciando proceso de login...'); // Debug
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Buscando usuario:', email); // Debug
      const user = mockUsers.find(u => u.email === email);
      console.log('Usuario encontrado:', user); // Debug

      if (!user) {
        setError({
          title: 'Usuario no encontrado',
          message: 'El correo electrónico no está registrado en nuestro sistema.'
        });
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setError({
          title: 'Contraseña incorrecta',
          message: 'La contraseña ingresada no es correcta.'
        });
        setIsLoading(false);
        return;
      }

      // Login exitoso
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        createdAt: user.createdAt
      };

      console.log('Guardando usuario en localStorage:', userWithoutPassword); // Debug
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      // Disparar evento de storage manualmente para actualizar otros componentes
      window.dispatchEvent(new Event('storage'));
      
      toast.success(`¡Bienvenido, ${user.name}!`);

      // Usamos window.location para forzar un refresh completo
      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/bogotanos';
      }

    } catch (err) {
      console.error('Error en login:', err); // Debug
      setError({
        title: 'Error de conexión',
        message: 'Hubo un problema al intentar iniciar sesión. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                />
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
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

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent className="bg-background border border-moradoclaro/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold text-rojoprimary">
              <AlertCircle className="h-6 w-6" />
              {error?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error?.message}
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
};

export default LoginPage;