"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Únete a Sensaciones Bogotá
          </CardTitle>
          <CardDescription className="text-center">
            Crea tu cuenta y conéctate con la comunidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">Nombre completo</label>
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              <Input
                id="name"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
                aria-required="true"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
                aria-required="true"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                required
                aria-required="true"
                minLength={8}
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
                required
                aria-required="true"
                minLength={8}
              />
            </div>
            <div className="relative">
              <label htmlFor="location" className="sr-only">Localidad en Bogotá</label>
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              <Input
                id="location"
                name="location"
                placeholder="Localidad en Bogotá"
                value={formData.location}
                onChange={handleChange}
                className="pl-10"
                required
                aria-required="true"
              />
            </div>
            <Button 
              type="submit"
              className="w-full"
            >
              Crear cuenta
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            asChild 
            className="w-full"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ya tengo una cuenta
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <Construction className="h-6 w-6" aria-hidden="true" />
              ¡Ups! Estamos en obras
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="text-lg">
                Nuestros desarrolladores están trabajando arduamente en el backend mientras toman tinto
              </div>
              <div className="flex items-center justify-center py-4">
                <Coffee className="h-12 w-12" aria-hidden="true" />
              </div>
              <div className="text-base italic">
                &quot;El código es como el café: debe hacerse fresco y consumirse mientras está caliente&quot;
                - Un desarrollador bogotano, probablemente
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowDialog(false)}
              className="w-full"
            >
              Vale, volveré después
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisterPage;