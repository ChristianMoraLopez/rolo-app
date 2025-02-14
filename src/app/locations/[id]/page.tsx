// src/app/locations/[id]/page.tsx
'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Share2, Flag, Clock } from 'lucide-react';
import Link from 'next/link';
import { mockLocations } from '@/infrastructure/mocks/data';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentSection } from '@/components/features/CommentSection';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const LocationDetailMap = dynamic(() => import('@/components/features/LocationDetailMap'), { 
  ssr: false 
});

export default function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const location = mockLocations.find(loc => loc.id === resolvedParams.id);

  if (!location) {
    notFound();
  }

  const formatDate = (date: Date) => {
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
            <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Bogotá
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(location.createdAt)}
              </span>
              <span>•</span>
              <span>Por {location.createdBy.name}</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-1">
                {location.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-video relative ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`${location.name} - Imagen ${index + 1}`}
                      width={image.width}
                      height={image.height}
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
                <div>
                  <h3 className="font-semibold mb-2">Sensaciones</h3>
                  <div className="flex flex-wrap gap-2">
                    {location.sensations.map(sensation => (
                      <Badge 
                        key={sensation}
                        variant="secondary"
                        className="bg-azulsecundario/20 text-azulsecundario"
                      >
                        {sensation}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Aromas</h3>
                  <div className="flex flex-wrap gap-2">
                    {location.smells.map(smell => (
                      <Badge 
                        key={smell}
                        variant="secondary"
                        className="bg-verdeprimario/20 text-verdeprimario"
                      >
                        {smell}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-lg mb-6">{location.description}</p>
              
              <div className="h-96 rounded-lg overflow-hidden">
                <LocationDetailMap location={location} />
              </div>
            </CardContent>
          </Card>

          <CommentSection comments={location.comments} locationId={location.id} />
        </div>
      </div>
    </div>
  );
}