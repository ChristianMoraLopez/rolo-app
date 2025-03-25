"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, 
  Smile, 
  Flag, 
  Check, 
  X, 
  AlertCircle, 
  MapPin,
  Sparkles,
  Wand2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLocation } from '@/hooks/useLocations';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for map component
const MapComponent = dynamic(() => import('@/components/features/MapComponent'), {
  ssr: false,
  loading: () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] bg-gradient-to-br from-blue-100/50 to-blue-200/30 animate-pulse rounded-3xl flex items-center justify-center"
    >
      <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
    </motion.div>
  )
});

export default function AddLocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createLocation, loading } = useLocation();
  const imageInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    position: null as [number, number] | null,
    address: '',
    sensations: [] as string[],
    smells: [] as string[],
    images: [] as { src: string; width: number; height: number; file?: File }[],
  });
  const [newSensation, setNewSensation] = useState('');
  const [newSmell, setNewSmell] = useState('');

  // Position conversion utility
  const convertPosition = (pos: { lat: number; lng: number } | [number, number]): [number, number] => {
    return Array.isArray(pos) ? pos : [pos.lat, pos.lng];
  };

  // Tag management
  const handleAddTag = (type: 'sensations' | 'smells', value: string) => {
    if (value && !formData[type].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value]
      }));
      
      // Reset input
      if (type === 'sensations') {
        setNewSensation('');
      } else {
        setNewSmell('');
      }
    }
  };

  const removeTag = (type: 'sensations' | 'smells', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Authentication and access control
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Redirect visitors away
      if (parsedUser.role === 'visitor') {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  // Image handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        src: URL.createObjectURL(file),
        width: 800,
        height: 600,
        file: file
      }));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.position || !formData.address) {
      toast({
        title: '✨ Detalles Pendientes',
        description: 'Por favor completa la magia de tu ubicación sensorial',
        variant: 'destructive'
      });
      return;
    }
  
    try {
      const locationData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        images: formData.images.map(img => img.file).filter(Boolean) as File[],
        sensations: formData.sensations,
        smells: formData.smells,
        coordinates: { 
          lat: formData.position[0], 
          lng: formData.position[1] 
        }
      };
  
      const newLocation = await createLocation(locationData);
      
      // Success notification
      toast({
        title: '🌟 ¡Ubicación Mágicamente Creada!',
        description: 'Tu experiencia sensorial ya está en el mapa',
      });
      
      // Redirect after success
      setTimeout(() => {
        router.push(`/locations/${newLocation._id}`);
      }, 2000);
  
    } catch (err) {
      console.error('Error creating location:', err);
      toast({
        title: '🔮 Oops, Algo Salió Mágicamente Mal',
        description: 'Intenta de nuevo, el universo conspiró contra nosotros',
        variant: 'destructive'
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 50 
      }}
      className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#E6EEFA] to-[#DCE7FD] p-4 md:p-8 flex items-center justify-center"
    >
      <motion.div 
        className="container mx-auto max-w-5xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <Card className="shadow-2xl shadow-blue-500/20 border-[1px] border-blue-100/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#6A11CB] via-[#2575FC] to-[#00D4FF] p-6 shadow-lg">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <Wand2 className="w-10 h-10 text-white" />
              <CardTitle className="text-4xl font-bold text-white tracking-tight">
                Crea tu Ubicación Sensorial
              </CardTitle>
            </motion.div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <motion.form 
              onSubmit={handleSubmit} 
              className="grid md:grid-cols-2 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* First Column */}
              <div className="space-y-8">
                {/* Name Input */}
                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-3"
                >
                  <label className="text-lg font-semibold text-blue-900/80">
                    Nombre del Lugar
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ej: Parque de los Sentidos"
                    className="border-blue-300/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-500 rounded-2xl text-lg"
                    required
                  />
                </motion.div>

                {/* Description Textarea */}
                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-3"
                >
                  <label className="text-lg font-semibold text-blue-900/80">
                    Descripción Sensorial
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe la experiencia sensorial única de este lugar..."
                    className="min-h-[150px] border-blue-300/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-500 rounded-2xl text-lg"
                    required
                  />
                </motion.div>

                {/* Map Component */}
                <div className="space-y-4">
                  <div className="relative h-[350px] rounded-2xl overflow-hidden border-2 border-blue-100/50 shadow-lg">
                    {typeof window !== 'undefined' && (
                      <MapComponent 
                        position={formData.position}
                        setPosition={(pos) => {
                          const convertedPos = convertPosition(pos);
                          setFormData(prev => ({
                            ...prev, 
                            position: convertedPos,
                            address: prev.address
                          }));
                        }}
                        setAddress={(address) => {
                          setFormData(prev => ({...prev, address}));
                        }}
                      />
                    )}
                  </div>
                  
                  {formData.position ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                      <MapPin className="w-4 h-4" />
                      Coordenadas: {formData.position[0].toFixed(4)}, {formData.position[1].toFixed(4)}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <AlertCircle className="w-4 h-4" />
                      Selecciona una ubicación en el mapa
                    </div>
                  )}
                </div>
              </div>

              {/* Second Column */}
              <div className="space-y-8">
                {/* Sensations */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-blue-900/80">
                    Sensaciones
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSensation}
                      onChange={(e) => setNewSensation(e.target.value)}
                      placeholder="Ej: Tranquilidad"
                      className="border-blue-300/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-500 rounded-2xl"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('sensations', newSensation))}
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddTag('sensations', newSensation)}
                      className="bg-blue-500 hover:bg-blue-600 rounded-xl"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-2"
                    layout
                  >
                    <AnimatePresence>
                      {formData.sensations.map((sensation, index) => (
                        <motion.div
                          key={sensation}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer bg-blue-100/70 text-blue-700 hover:bg-blue-200/80 rounded-full transition-colors"
                            onClick={() => removeTag('sensations', index)}
                          >
                            {sensation}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Smells */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-blue-900/80">
                    Aromas
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSmell}
                      onChange={(e) => setNewSmell(e.target.value)}
                      placeholder="Ej: Café recién molido"
                      className="border-blue-300/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all duration-500 rounded-2xl"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('smells', newSmell))}
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddTag('smells', newSmell)}
                      className="bg-purple-500 hover:bg-purple-600 rounded-xl"
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-2"
                    layout
                  >
                    <AnimatePresence>
                      {formData.smells.map((smell, index) => (
                        <motion.div
                          key={smell}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer bg-purple-100/70 text-purple-700 hover:bg-purple-200/80 rounded-full transition-colors"
                            onClick={() => removeTag('smells', index)}
                          >
                            {smell}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-blue-900/80">
                    Capturas de Magia
                  </label>
                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    layout
                  >
                    <motion.label 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-blue-300/50 rounded-2xl hover:bg-blue-50/30 hover:border-blue-400/70 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-12 h-12 text-blue-500 mb-3 animate-pulse" />
                      <span className="text-base text-blue-600 font-medium">
                        Añadir Imágenes
                      </span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </motion.label>

                    <AnimatePresence>
                      {formData.images.map((image, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.3 }}
                          className="relative aspect-square"
                        >
                          <Image
                            src={image.src}
                            alt={`Imagen ${index + 1}`}
                            width={image.width}
                            height={image.height}
                            className="rounded-xl object-cover w-full h-full shadow-md"
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white shadow-sm"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div 
                className="col-span-full flex justify-end mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#6A11CB] to-[#2575FC] hover:from-[#4A00E0] hover:to-[#00D4FF] text-white rounded-full px-8 py-4 text-lg transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center">
                    <Check className="w-6 h-6 mr-3" />
                    {loading ? "Guardando Magia..." : "Crear Ubicación"}
                  </span>
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>

      <Toaster />
    </motion.div>
  );
}