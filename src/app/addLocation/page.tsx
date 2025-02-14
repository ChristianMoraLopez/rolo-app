"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/core/entities/types';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Smile, Flag, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Construction, Coffee } from 'lucide-react';

interface LocationMarkerProps {
    position: [number, number];
    setPosition: (pos: [number, number]) => void;
  }

  const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition }) => {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

  return position ? (
    <Marker 
      position={position}
      icon={divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-verdeprimary rounded-full border-2 border-white shadow-lg">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>`,
        className: 'custom-marker'
      })}
    />
  ) : null;
};

export default function AddLocationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    position: null as [number, number] | null,
    sensations: [] as string[],
    smells: [] as string[],
    images: [] as { src: string; width: number; height: number }[],
  });
  const [newSensation, setNewSensation] = useState('');
  const [newSmell, setNewSmell] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login'); 
    }
  }, [router]);
  
  useEffect(() => {
    if (user && user.role === 'visitor') {
      router.push('/login'); 
    }
  }, [user, router]);

  const handleAddTag = (type: 'sensations' | 'smells', value: string) => {
    if (value && !formData[type].includes(value)) {
      setFormData({
        ...formData,
        [type]: [...formData[type], value]
      });
      if (type === 'sensations') setNewSensation('');
      else setNewSmell('');
    }
  };

  const removeTag = (type: 'sensations' | 'smells', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        src: URL.createObjectURL(file),
        width: 800,
        height: 600,
      }));
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-verdereducido/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="border-b border-verdeprimary/20">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-verdeprimary to-verdehover bg-clip-text text-transparent">
                Nueva Ubicación Sensorial
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); setShowDialog(true); }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Nombre del lugar
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border-verdeprimary/20 focus:border-verdeprimary focus:ring-verdeprimary/20"
                        placeholder="Ej: Parque de los Sentidos"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Descripción
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[120px] border-verdeprimary/20 focus:border-verdeprimary focus:ring-verdeprimary/20"
                        placeholder="Describe la experiencia sensorial de este lugar..."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="relative h-[300px] rounded-lg overflow-hidden border-2 border-verdeprimary/20">
                        <MapContainer
                          center={[4.6097, -74.0817]}
                          zoom={11}
                          className="h-full w-full"
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationMarker
                            position={formData.position!}
                            setPosition={(pos) => setFormData({...formData, position: pos})}
                          />
                        </MapContainer>
                      </div>
                      {formData.position && (
                        <div className="text-sm text-center text-foreground/60">
                          Coordenadas: {formData.position[0].toFixed(4)}, {formData.position[1].toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Sensaciones
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={newSensation}
                          onChange={(e) => setNewSensation(e.target.value)}
                          className="border-azulprimary/20"
                          placeholder="Ej: Tranquilidad"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag('sensations', newSensation)}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddTag('sensations', newSensation)}
                          className="bg-azulprimary hover:bg-azulhover transition-colors"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.sensations.map((sensation, index) => (
                          <Badge
                            key={index}
                            className="px-3 py-1 bg-azulprimary/10 text-azulprimary hover:bg-azulprimary/20 transition-colors cursor-pointer"
                            onClick={() => removeTag('sensations', index)}
                          >
                            {sensation}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Aromas
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={newSmell}
                          onChange={(e) => setNewSmell(e.target.value)}
                          className="border-moradoprimary/20"
                          placeholder="Ej: Café recién molido"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag('smells', newSmell)}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddTag('smells', newSmell)}
                          className="bg-moradoprimary hover:bg-moradohover transition-colors"
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.smells.map((smell, index) => (
                          <Badge
                            key={index}
                            className="px-3 py-1 bg-moradoprimary/10 text-moradoprimary hover:bg-moradoprimary/20 transition-colors cursor-pointer"
                            onClick={() => removeTag('smells', index)}
                          >
                            {smell}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">
                        Imágenes
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-verdeprimary/20 rounded-lg hover:bg-verdeprimary/5 transition-colors cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-verdeprimary mb-2" />
                          <span className="text-sm text-verdeprimary">Agregar imágenes</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image
                              src={image.src}
                              alt={`Imagen ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                images: formData.images.filter((_, i) => i !== index)
                              })}
                              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                              <X className="w-4 h-4 text-rojoprimary" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-verdeprimary to-verdehover hover:from-verdesaturado hover:to-verdelight text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Guardar Ubicación
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-verdeprimary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-verdeprimary to-verdehover bg-clip-text text-transparent">
              <Construction className="h-8 w-8 text-verdeprimary" />
              ¡Oops! Estamos en mantenimiento
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <span className="text-lg text-gray-600">
                Nuestros desarrolladores están ajustando el código mientras disfrutan de un buen café de la zona.
              </span>
              <span className="flex items-center justify-center py-6">
                <Coffee className="h-16 w-16 text-verdehover animate-bounce" />
              </span>
              <div className="text-base italic text-gray-500 bg-gray-50 p-4 rounded-lg">
                &quot;El código es como el clima en Bogotá: si no te gusta, espera un rato y cambiará&quot;
                <br />
                <span className="text-sm text-right block mt-2">- Un desarrollador bogotano, probablemente</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowDialog(false)}
              className="w-full bg-gradient-to-r from-verdeprimary to-verdehover hover:from-verdesaturado hover:to-verdelight text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Entendido, volveré más tarde
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}