"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Share2, Filter, Star } from 'lucide-react';
import { mockLocations } from '@/infrastructure/mocks/data';
import { SearchBar } from '@/components/features/Searchbar';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const [filteredLocations, setFilteredLocations] = useState(mockLocations);
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  interface Location {
    id: string;
    name: string;
    description: string;
  }
  
  const handleShare = async (location: Location, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: location.name,
        text: location.description,
        url: `/locations/${location.id}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background">
      

      <div className="container mx-auto px-4 py-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/locations/${location.id}`}>
                <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-azulclaro/20 overflow-hidden bg-white/50 backdrop-blur-md">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <Image
                        src={location.images[0].src}
                        alt={location.name}
                        width={location.images[0].width}
                        height={location.images[0].height}
                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button 
                          onClick={(e) => toggleFavorite(location.id, e)}
                          className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
                        >
                          <Heart 
                            className={`w-5 h-5 ${
                              favorites.includes(location.id) 
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
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-center text-white mb-2">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span className="text-lg font-semibold">{location.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-azulsecundario mr-1" />
                          <span className="text-sm text-white/90">4.8</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {location.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {location.sensations.map(sensation => (
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
                        {location.smells.map(smell => (
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

                    {location.comments.length > 0 && (
                      <div className="border-t border-azulclaro/20 pt-4 mt-6">
                        <p className="text-sm text-muted-foreground italic">
                          &quot;{location.comments[0].content}&quot;
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-8 h-8 rounded-full bg-azulprimary/10 flex items-center justify-center mr-2">
                            <span className="text-sm text-azulprimary font-medium">
                              {location.comments[0].user.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-azulprimary">
                            {location.comments[0].user.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}