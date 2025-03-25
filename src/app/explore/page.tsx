//src\app\explore\page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { LocationType } from '@/core/entities/locationType';
import { useLocation } from '@/hooks/useLocations';
import { SearchBar } from '@/components/features/Searchbar';

export default function ExplorePage() {
  const { locations, loading, error } = useLocation();
  
  // State management for locations, filtering, and favorites
  const [filteredLocations, setFilteredLocations] = useState<LocationType[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Update filtered locations when locations change
  useEffect(() => {
    setFilteredLocations(locations);
  }, [locations]);

  // Search functionality
  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = locations.filter(location => 
      location.name.toLowerCase().includes(lowercaseQuery) ||
      (Array.isArray(location.sensations) && location.sensations.some((sensation: string) => 
        sensation.toLowerCase().includes(lowercaseQuery)
      )) ||
      (Array.isArray(location.smells) && location.smells.some((smell: string) => 
        smell.toLowerCase().includes(lowercaseQuery)
      )) ||
      location.description.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredLocations(filtered);
  };

  // Favorite toggle functionality
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Share location functionality
  const handleShare = async (location: LocationType, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: location.name,
        text: location.description,
        url: `/locations/${location._id}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Cargando lugares...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error al cargar lugares: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold pb-4 bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent mb-4">
            Explora Bogotá
          </h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            Descubre los lugares más sensoriales de la ciudad a través de experiencias únicas
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="relative mb-12">
          <SearchBar 
            onSearch={handleSearch}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300" 
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-azulprimary/10 hover:bg-azulprimary/20 transition-colors"
          >
            <Filter className="w-5 h-5 text-azulprimary" />
          </button>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-white/50 backdrop-blur-md rounded-xl shadow-lg"
          >
            <div className="flex gap-4 flex-wrap justify-center">
              {['all', 'popular', 'new', 'featured'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === filter 
                      ? 'bg-azulprimary text-white shadow-md' 
                      : 'bg-azulprimary/10 text-azulprimary hover:bg-azulprimary/20'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Location Cards Grid */}
        {filteredLocations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron lugares que coincidan con la búsqueda
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLocations.map((location, index) => (
              <motion.div
                key={location._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/locations/${location._id}`}>
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-azulclaro/20 overflow-hidden bg-white/50 backdrop-blur-md">
                    {/* Location Card Header with Image */}
                    <CardHeader className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        {location.images.length > 0 && (
                          <>
                            <Image
                              src={location.images[0].src}
                              alt={location.name}
                              width={location.images[0].width}
                              height={location.images[0].height}
                              className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Favorite and Share Buttons */}
                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                              <button 
                                onClick={(e) => toggleFavorite(location._id, e)}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
                              >
                                <Heart 
                                  className={`w-5 h-5 ${
                                    favorites.includes(location._id) 
                                      ? 'text-rojoprimary fill-rojoprimary' 
                                      : 'text-white'
                                  }`} 
                                />
                              </button>
                              <button 
                                onClick={(e) => handleShare(location, e)}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
                              >
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>

                    {/* Location Card Content */}
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {location.description}
                      </p>
                      
                      {/* Sensations and Smells Badges */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {location.sensations.map((sensation: string) => (
                            <Badge 
                              key={sensation}
                              variant="secondary"
                              className="bg-gradient-to-r from-azulprimary/10 to-azulsecundario/10 text-azulprimary px-3 py-1 rounded-full"
                            >
                              {sensation}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {location.smells.map((smell: string) => (
                            <Badge 
                              key={smell}
                              variant="secondary"
                              className="bg-gradient-to-r from-verdeprimary/10 to-verdelight/10 text-verdeprimary px-3 py-1 rounded-full"
                            >
                              {smell}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}