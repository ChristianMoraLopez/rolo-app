'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Share2, Flag, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentSection } from '@/components/features/CommentSection';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useLocation } from '@/hooks/useLocations';
import { getCreatorName } from '@/core/entities/locationType';
import { mapLocationCommentToComment } from '@/core/entities/commentsTypes';

const LocationDetailMap = dynamic(() => import('@/components/features/LocationDetailMap'), { 
  ssr: false,
  loading: () => <p>Loading map...</p>
});

interface LocationPageProps {
  params: { id: string };
}

export default function LocationPage({ params }: LocationPageProps) {
  const { id } = params;

  const { fetchLocationById, currentLocation, error } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocationData = async () => {
      setIsLoading(true);
      try {
        await fetchLocationById(id);
      } catch (err) {
        console.error("Error loading location:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocationData();
  }, [id, fetchLocationById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando información...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-rojoprimary">
          Error al cargar la ubicación: {error.message}
        </div>
      </div>
    );
  }

  // Función para procesar strings de arrays JSON
  function processArrayString(input: string[]): string[] {
    try {
      // Si el input es un array con un solo elemento que parece ser un string JSON
      if (input.length === 1 && typeof input[0] === 'string') {
        // Intenta parsear directamente ese string
        const parsedArray = JSON.parse(input[0]);
        
        // Si el resultado es un array, devuélvelo
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        }
      }
      
      // Si el parsing inicial falla, intenta el método original
      const jsonString = input.join(""); 
      const parsedArray = JSON.parse(jsonString);
      
      // Devolver todos los elementos si es un array
      return Array.isArray(parsedArray) ? parsedArray : input;
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return input;
    }
  }

  if (!currentLocation) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-azulprimary hover:text-azulhover mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentLocation.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {currentLocation.name || 'Bogotá'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(new Date(currentLocation.createdAt).toString())}
                </span>
              <span>•</span>
              <span>Por {getCreatorName(currentLocation.createdBy)}</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-1">
                {currentLocation.images && currentLocation.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-video relative ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <Image
                      src={image.src || ''}
                      alt={`${currentLocation.name} - Imagen ${index + 1}`}
                      width={image.width || 800}
                      height={image.height || 600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mb-8">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" className="flex-1 text-rojoprimary hover:text-rojohover">
              <Flag className="w-4 h-4 mr-2" />
              Reportar
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 border-r border-gray-100 pr-4">
                  <h3 className="text-sm font-semibold text-verdeprimary mb-2">Olores</h3>
                  {currentLocation.smells && (
                    <div className="flex flex-col space-y-2">
                      {processArrayString(currentLocation.smells).map((smell: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="bg-verdeprimary/10 text-verdeprimary text-xs self-start"
                        >
                          {smell}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 pl-4">
                  <h3 className="text-sm font-semibold text-azulprimary mb-2">Sensaciones</h3>
                  {currentLocation.sensations && (
                    <div className="flex flex-col space-y-2">
                      {processArrayString(currentLocation.sensations).map((sensation: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="bg-azulprimary/10 text-azulprimary text-xs self-start"
                        >
                          {sensation}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-lg mb-6">{currentLocation.description}</p>
              
              <div className="h-96 rounded-lg overflow-hidden">
                <LocationDetailMap location={currentLocation} />
              </div>
            </CardContent>
          </Card>

          <CommentSection
              comments={currentLocation.commentsList.map((comment) => 
                mapLocationCommentToComment(comment, currentLocation._id)
              ) || []}
              locationId={currentLocation._id}
            />
        </div>
      </div>
    </div>
  );
}