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
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-azulsecundario/20 transition-all duration-300 hover:shadow-azulsecundario/20">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-azulprimary to-azulsecundario flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-azulprimary to-azulsecundario bg-clip-text text-transparent">
            Únete a Sensaciones Bogotá
          </CardTitle>
          <CardDescription className="text-center text-lg text-gray-600">
            Crea tu cuenta y conéctate con la comunidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <label htmlFor="name" className="sr-only">Nombre completo</label>
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-azulprimary" aria-hidden="true" />
              <Input
                id="name"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 border-gray-200 focus:border-azulprimary focus:ring-azulclaro transition-all"
                required
                aria-required="true"
              />
            </div>
            <div className="relative group">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-azulprimary" aria-hidden="true" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 border-gray-200 focus:border-azulprimary focus:ring-azulclaro transition-all"
                required
                aria-required="true"
              />
            </div>
            <div className="relative group">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-azulprimary" aria-hidden="true" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 border-gray-200 focus:border-azulprimary focus:ring-azulclaro transition-all"
                required
                aria-required="true"
                minLength={8}
              />
            </div>
            <div className="relative group">
              <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-azulprimary" aria-hidden="true" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 border-gray-200 focus:border-azulprimary focus:ring-azulclaro transition-all"
                required
                aria-required="true"
                minLength={8}
              />
            </div>
            <div className="relative group">
              <label htmlFor="location" className="sr-only">Localidad en Bogotá</label>
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-azulprimary" aria-hidden="true" />
              <Input
                id="location"
                name="location"
                placeholder="Localidad en Bogotá"
                value={formData.location}
                onChange={handleChange}
                className="pl-10 border-gray-200 focus:border-azulprimary focus:ring-azulclaro transition-all"
                required
                aria-required="true"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-azulprimary to-azulsecundario hover:from-azulhover hover:to-azulsechover text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-azulclaro"
            >
              Crear cuenta
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            asChild 
            className="w-full border-gray-200 hover:bg-gray-50 hover:border-azulprimary transition-all duration-300"
          >
            <Link href="/login" className="flex items-center justify-center gap-2 text-gray-600 hover:text-azulprimary">
              <ArrowLeft className="h-4 w-4" />
              Ya tengo una cuenta
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-azulsecundario/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-azulprimary to-azulsecundario bg-clip-text text-transparent">
              <Construction className="h-8 w-8 text-azulprimary" aria-hidden="true" />
              ¡Ups! Estamos en obras
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <span className="text-lg text-gray-600">
                Nuestros desarrolladores están trabajando arduamente en el backend mientras toman tinto
              </span>
              <div className="flex items-center justify-center py-6">
                <Coffee className="h-16 w-16 text-azulsecundario animate-bounce" aria-hidden="true" />
              </div>
              <div className="text-base italic text-gray-500 bg-gray-50 p-4 rounded-lg">
                &quot;El código es como el café: debe hacerse fresco y consumirse mientras está caliente&quot;
                <br />
                <span className="text-sm text-right block mt-2">- Un desarrollador bogotano, probablemente</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowDialog(false)}
              className="w-full bg-gradient-to-r from-azulprimary to-azulsecundario hover:from-azulhover hover:to-azulsechover text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
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