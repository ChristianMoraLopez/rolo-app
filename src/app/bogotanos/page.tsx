"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post as PostType } from '@/core/entities/types';
import  Image  from 'next/image';
import { Heart, MessageCircle, Share2, UserCircle2, MapPin, Image as ImageIcon } from 'lucide-react';

interface PostProps {
    post: PostType;
  }
  
  const Post: React.FC<PostProps> = ({ post }) => {
    const [liked, setLiked] = useState(post.liked || false);
  return (
    <Card className="mb-4 border-moradoclaro/20">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>
              <UserCircle2 className="h-10 w-10 text-moradoprimary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-foreground">{post.author.name}</div>
            <div className="flex items-center text-sm text-foreground/60">
              <MapPin className="mr-1 h-3 w-3" />
              {post.author.location}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 mb-4">{post.content}</p>
        {post.image && (
          <div className="relative rounded-lg overflow-hidden">
            <Image
  src={post.image} // Ruta de la imagen
  alt={post.title || "Descripción de la imagen"} // Texto alternativo (obligatorio)
  width={800} // Ancho de la imagen (en píxeles)
  height={600} // Alto de la imagen (en píxeles)
  className="w-full h-auto" // Clases de CSS
/>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-moradoclaro/20 pt-4">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`hover:text-rojoprimary ${liked ? 'text-rojoprimary' : 'text-foreground/60'}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className="h-5 w-5 mr-1" />
            {post.likes + (liked ? 1 : 0)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground/60 hover:text-moradoprimary"
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            {post.comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground/60 hover:text-azulprimary"
          >
            <Share2 className="h-5 w-5 mr-1" />
            Compartir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const SocialFeed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedTab, setSelectedTab] = useState('todos');
  const [posts] = useState([
    {
        id: "1", // Cambia a string
        title: "Tarde en el Parque de los Novios", // Agrega título
        author: {
          id: "1", // Cambia a string
          name: "Ana María Rodríguez",
          avatar: "/avatars/ana.jpg",
          location: "Chapinero",
        },
        content: "¡Increíble tarde en el Parque de los Novios! ¿Alguien más para un picnic este fin de semana? 🌳☀️",
        likes: 24,
        comments: 8,
        image: "/posts/parque.jpg",
        createdAt: new Date(), // Agrega fecha de creación
      },
      {
        id: "2", // Cambia a string
        title: "Nuevo café en la Zona G", // Agrega título
        author: {
          id: "2", // Cambia a string
          name: "Carlos Martínez",
          avatar: "/avatars/carlos.jpg",
          location: "Usaquén",
        },
        content: "Descubrí este nuevo café en la Zona G. ¡La mejor avena que he probado! ¿Recomendaciones de otros cafés por la zona? ☕",
        likes: 15,
        comments: 12,
        createdAt: new Date(), // Agrega fecha de creación
      },
  ]);

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    if (newPost.trim()) {
      // Aquí iría la lógica para crear un nuevo post
      setNewPost(""); // Limpia el campo de entrada
    }
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Create Post */}
        <Card className="mb-8 border-moradoclaro/20">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar-placeholder.jpg" />
                <AvatarFallback>
                  <UserCircle2 className="h-10 w-10 text-moradoprimary" />
                </AvatarFallback>
              </Avatar>
              <form onSubmit={handleCreatePost} className="flex-1 flex gap-2">
                <Input
                  placeholder="¿Qué estás sintiendo en Bogotá?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-1 bg-background border-moradoclaro/20 focus-visible:ring-moradoprimary"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-moradoclaro/20 hover:bg-moradoclaro/10 hover:text-moradoprimary"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white"
                >
                  Publicar
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for filtering */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="siguiendo">Siguiendo</TabsTrigger>
            <TabsTrigger value="populares">Populares</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </TabsContent>
          <TabsContent value="siguiendo">
            <div className="text-center text-foreground/60 py-8">
              Aún no sigues a nadie. ¡Encuentra personas con intereses similares!
            </div>
          </TabsContent>
          <TabsContent value="populares">
            {posts
              .sort((a, b) => b.likes - a.likes)
              .map((post) => (
                <Post key={post.id} post={post} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default SocialFeed;