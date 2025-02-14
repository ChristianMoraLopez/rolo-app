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
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { Mail, Lock, User, MapPin, ArrowLeft, Construction, Coffee } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });
  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-moradoclaro/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent">
            Únete a Sensaciones Bogotá
          </CardTitle>
          <CardDescription className="text-center text-foreground/60">
            Crea tu cuenta y conéctate con la comunidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <Input
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <Input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
              <Input
                name="location"
                placeholder="Localidad en Bogotá"
                value={formData.location}
                onChange={handleChange}
                className="pl-10 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Crear cuenta
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            asChild 
            className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary transition-all duration-300"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ya tengo una cuenta
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-background border border-moradoclaro/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Construction className="h-6 w-6 text-moradoprimary animate-bounce" />
              ¡Ups! Estamos en obras
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="text-lg text-foreground/80">
                Nuestros desarrolladores están trabajando arduamente en el backend mientras toman tinto ☕
              </div>
              <div className="flex items-center justify-center py-4">
                <Coffee className="h-12 w-12 text-azulsecundario animate-pulse" />
              </div>
              <div className="text-base text-foreground/60 italic">
              &quot;El código es como el café: debe hacerse fresco y consumirse mientras está caliente&quot;
                - Un desarrollador bogotano, probablemente
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => setShowDialog(false)}
              className="w-full bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white"
            >
              Vale, volveré después
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisterPage;