// src/components/features/FeaturedLocations.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { mockLocations } from '@/infrastructure/mocks/data';
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import { SearchBar } from '@components/features/Searchbar';

export function FeaturedLocations() {
  const [filteredLocations, setFilteredLocations] = useState(mockLocations);

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = mockLocations.filter(location => {
      return (
        location.name.toLowerCase().includes(lowercaseQuery) ||
        location.sensations.some(sensation => 
          sensation.toLowerCase().includes(lowercaseQuery)
        ) ||
        location.smells.some(smell => 
          smell.toLowerCase().includes(lowercaseQuery)
        ) ||
        location.description.toLowerCase().includes(lowercaseQuery)
      );
    });
    setFilteredLocations(filtered);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Lugares Destacados</h2>
          <p className="text-muted-foreground mt-2">Descubre espacios únicos de nuestra ciudad</p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map(location => (
          <Link href={`/locations/${location.id}`} key={location.id}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-azulclaro/20">
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
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
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {location.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {location.sensations.map(sensation => (
                      <Badge 
                        key={sensation}
                        variant="secondary"
                        className="bg-azulprimary/10 text-azulprimary"
                      >
                        {sensation}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {location.smells.map(smell => (
                      <Badge 
                        key={smell}
                        variant="secondary"
                        className="bg-verdeprimary/10 text-verdeprimary"
                      >
                        {smell}
                      </Badge>
                    ))}
                  </div>
                </div>

                {location.comments.length > 0 && (
                  <div className="border-t border-azulclaro/20 pt-4 mt-4">
                    <p className="text-sm text-muted-foreground italic">
                      &quot;{location.comments[0].content}&quot;
                    </p>
                    <p className="text-sm text-azulprimary mt-2">
                      {location.comments[0].user.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}