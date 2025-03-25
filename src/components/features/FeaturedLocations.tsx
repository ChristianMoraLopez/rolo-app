// src/components/features/FeaturedLocations.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Quote } from 'lucide-react';
import { SearchBar } from '@components/features/Searchbar';
import { useLocation } from '@/hooks/useLocations';
import { LocationType } from '@/core/entities/locationType';

// Función para procesar strings de arrays JSON
function processArrayString(input: string[]){
  try {
      // Convertir el array a un string JSON válido
      const jsonString = input.join(""); // O input.join(",") si los elementos son separados por comas
    
      // Parsear el string JSON
      const parsedArray = JSON.parse(jsonString);
    
    // Devolver el primer elemento si es un array
    return Array.isArray(parsedArray) ? parsedArray[0] : input;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return input;
  }
}

export function FeaturedLocations() {
  const { locations, loading, error } = useLocation();
  const [filteredLocations, setFilteredLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    setFilteredLocations(locations);
  }, [locations]);

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = locations.filter(location => {
      return (
        location.name.toLowerCase().includes(lowercaseQuery) ||
        location.description.toLowerCase().includes(lowercaseQuery)
      );
    });
    setFilteredLocations(filtered);
  };

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="text-center py-8">Cargando lugares...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar lugares: {error.message}</div>;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Lugares Destacados</h2>
          <p className="text-muted-foreground mt-2">Descubre espacios únicos de nuestra ciudad</p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      {filteredLocations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron lugares que coincidan con la búsqueda
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(location => (
            <Link href={`/locations/${location._id}`} key={location._id}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-azulclaro/20 h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    {location.images.length > 0 && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        <Image
                          src={location.images[0].src}
                          alt={location.name}
                          width={location.images[0].width}
                          height={location.images[0].height}
                          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-3 left-3 z-20 flex items-center text-white">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{location.name}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {truncateDescription(location.description)}
                  </p>
                  
                  {location.commentsList.length > 0 && (
                    <div className="flex items-start mb-4 text-sm text-muted-foreground italic">
                      <Quote className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <p className="line-clamp-2">
                        {location.commentsList[0].content}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {location.sensations && (
                        <Badge 
                          variant="secondary"
                          className="bg-azulprimary/10 text-azulprimary text-xs"
                        >
                           {processArrayString(location.sensations)} ...
                        </Badge>
                      )}
                      {location.smells && (
                        <Badge 
                          variant="secondary"
                          className="bg-verdeprimary/10 text-verdeprimary text-xs"
                        >
                          {processArrayString(location.smells)} ...
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}