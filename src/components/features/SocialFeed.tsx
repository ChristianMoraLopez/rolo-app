"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PostType } from '@/core/entities/types';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, UserCircle2, MapPin, Image as ImageIcon, X, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/core/services/post';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

// Configuración del cliente socket.io
const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 border-moradoclaro/20 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-moradoclaro/30">
              <AvatarImage src={post.author?.avatar || ''} />
              <AvatarFallback>
                <UserCircle2 className="h-12 w-12 text-moradoprimary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-lg">{post.author?.name  || 'Usuario desconocido'}</div>
              <div className="flex items-center text-sm text-foreground/60">
                <MapPin className="mr-1 h-3 w-3" />
                {post.author?.location || 'Ubicación desconocida'}
                <span className="mx-2">•</span>
                <span className="text-xs">hace 2 horas</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-4 text-base">{post.content}</p>
          {post.image && (
            <div className="relative rounded-xl overflow-hidden shadow-md my-3">
              <Image
                src={post.image}
                alt={post.title || "Imagen del post"}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-moradoclaro/20 pt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-rojoprimary font-medium transition-colors duration-200 ${liked ? 'text-rojoprimary' : 'text-foreground/60'}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 mr-1 ${liked ? 'fill-rojoprimary' : ''}`} />
              {likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground/60 hover:text-moradoprimary font-medium transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
              {post.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground/60 hover:text-azulprimary font-medium transition-colors duration-200"
            >
              <Share2 className="h-5 w-5 mr-1" />
              Compartir
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
interface PostData {
  content: string;
  image?: File;
}


interface CreatePostDialogControlledProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (postData: PostData) => Promise<void>;
}

const CreatePostDialogControlled: React.FC<CreatePostDialogControlledProps> = ({
  open,
  onOpenChange,
  onPostCreated
}) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
      
      // Crear URL para previsualización
      const previewURL = URL.createObjectURL(files[0]);
      setImagePreviews([previewURL]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('El contenido del post no puede estar vacío.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        title: 'Nuevo Post',
        content,
        author: user?._id,
        image,
      };
      
      await onPostCreated(postData);
      
      // Limpiar el formulario y cerrar el diálogo
      setContent('');
      setImage(undefined);
      setImagePreviews([]);
      setError(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear el post:', error);
      setError('Error al crear el post. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Card className="mb-8 border-moradoclaro/20 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-moradoclaro/30">
                <AvatarImage src={user?.avatar || "/avatar-placeholder.jpg"} />
                <AvatarFallback>
                  <UserCircle2 className="h-12 w-12 text-moradoprimary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-background/80 rounded-full py-3 px-6 border border-moradoclaro/30 text-foreground/60 hover:border-moradoprimary/50 transition-colors duration-200">
                ¿Qué estás sintiendo en Bogotá?
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="bg-gradient-to-r from-moradoprimary to-azulsecundario p-4">
          <DialogTitle className="text-white text-xl font-bold">Crear nuevo post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/avatar-placeholder.jpg"} />
              <AvatarFallback>
                <UserCircle2 className="h-10 w-10 text-moradoprimary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user?.name || "Usuario"}</div>
              <div className="text-xs text-foreground/60 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Bogotá, Colombia
              </div>
            </div>
          </div>
          
          <Textarea
            placeholder="¿Qué estás sintiendo en Bogotá?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none mb-4 border-moradoclaro/30 focus-visible:ring-moradoprimary"
          />
          
          <AnimatePresence>
            {imagePreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="relative rounded-lg overflow-hidden border border-moradoclaro/30">
                  <Image
                    src={imagePreviews[0]}
                    alt="Vista previa"
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeImage(0)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-between items-center">
            <div>
              <input
                type="file"
                id="post-image"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-moradoprimary border-moradoclaro/30 hover:bg-moradoprimary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Añadir foto
              </Button>
            </div>
            
            <Button
              type="submit"
              className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
const MobileCreatePostButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover z-10 md:hidden"
      size="icon"
      onClick={onClick}
    >
      <PlusCircle className="h-8 w-8 text-white" />
    </Button>
  );
};

interface PostData {
  title: string;
  content: string;
  image?: File;
  location?: string;
}


const SocialFeed = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('todos');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newPostNotification, setNewPostNotification] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [temporaryNewPosts, setTemporaryNewPosts] = useState<PostType[]>([]);

  // Función para cargar posts
  const fetchPosts = async () => {
    try {
      const fetchedPosts = await postService.getPosts();
      const sortedPosts = [...fetchedPosts].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return String(b._id).localeCompare(String(a._id));
      });
      setPosts(sortedPosts);
      setTemporaryNewPosts([]);
      setNewPostsCount(0);
      setNewPostNotification(false);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  };

  // Configurar socket.io al cargar el componente
  useEffect(() => {
    // Cargar posts al iniciar
    fetchPosts();

    // Manejar conexión
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets');
      setIsConnected(true);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log('Desconectado del servidor de WebSockets');
      setIsConnected(false);
    });

    // Escuchar nuevos posts
    socket.on('new_post', (newPost: PostType) => {
      console.log('Nuevo post recibido:', newPost);
      
      // Comprobar si el post ya existe (evitar duplicados)
      setPosts(currentPosts => {
        if (currentPosts.some(post => post._id === newPost._id)) {
          return currentPosts;
        }
        
        // Si estamos en la parte superior de la página, añadir directamente
        if (window.scrollY < 100) {
          return [newPost, ...currentPosts];
        } else {
          // Si el usuario ha desplazado hacia abajo, guardar temporalmente y mostrar notificación
          setTemporaryNewPosts(prev => [newPost, ...prev]);
          setNewPostsCount(prev => prev + 1);
          setNewPostNotification(true);
          return currentPosts;
        }
      });
    });

    // Limpiar listeners al desmontar
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_post');
    };
  }, []);

  // Manejar la creación de un nuevo post
  const handleCreatePost = async (postData: PostData) => {
    try {
      // Crear el post en el servidor
      await postService.createPost(postData);
      // No es necesario devolver nada, ya que el nuevo post se manejará a través del socket.io
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw error; // Propagar el error para que pueda manejarse en el componente CreatePostDialogControlled
    }
  };

  // Función para cargar nuevos posts
  const loadNewPosts = () => {
    setPosts(currentPosts => [...temporaryNewPosts, ...currentPosts]);
    setTemporaryNewPosts([]);
    setNewPostsCount(0);
    setNewPostNotification(false);
    // Desplazar al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to sort posts by date (newest first)
  const getSortedPosts = (postsToSort: PostType[]) => {
    return [...postsToSort].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return String(b._id).localeCompare(String(a._id));
    });
  };

  const openMobileDialog = () => {
    setDialogOpen(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Desktop Create Post Trigger with controlled dialog */}
        <div className="hidden md:block">
          <CreatePostDialogControlled
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onPostCreated={handleCreatePost}
          />
        </div>

        {/* Sticky header with tabs and new posts notification */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2">
          {newPostNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Button
                onClick={loadNewPosts}
                className="w-full bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white py-2 rounded-xl shadow-md"
              >
                Ver {newPostsCount} {newPostsCount === 1 ? 'nuevo post' : 'nuevos posts'} 
              </Button>
            </motion.div>
          )}

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-background/90 border border-moradoclaro/30 rounded-full">
              <TabsTrigger 
                value="todos" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-moradoprimary data-[state=active]:to-azulsecundario data-[state=active]:text-white"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="siguiendo" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-moradoprimary data-[state=active]:to-azulsecundario data-[state=active]:text-white"
              >
                Siguiendo
              </TabsTrigger>
              <TabsTrigger 
                value="populares" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-moradoprimary data-[state=active]:to-azulsecundario data-[state=active]:text-white"
              >
                Populares
              </TabsTrigger>
            </TabsList>
            
            {/* TabsContent para cada categoría */}
            <TabsContent value="todos" className="mt-0">
              {posts.length > 0 ? (
                getSortedPosts(posts).map((post) => <Post key={post._id} post={post} />)
              ) : (
                <div className="text-center text-foreground/60 py-12 border border-dashed border-moradoclaro/30 rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-moradoclaro" />
                  <p className="text-lg font-medium">No hay publicaciones para mostrar</p>
                  <p className="text-sm">¡Sé el primero en compartir algo interesante!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="siguiendo" className="mt-0">
              <div className="text-center text-foreground/60 py-12 border border-dashed border-moradoclaro/30 rounded-lg">
                <UserCircle2 className="h-12 w-12 mx-auto mb-4 text-moradoclaro" />
                <p className="text-lg font-medium">Aún no sigues a nadie</p>
                <p className="text-sm mb-4">¡Encuentra personas con intereses similares!</p>
                <Button className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white">
                  Explorar perfiles
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="populares" className="mt-0">
              {posts.length > 0 ? (
                // First sort by likes, then by date for posts with same number of likes
                [...posts]
                  .sort((a, b) => {
                    const likeDiff = (b.likes || 0) - (a.likes || 0);
                    if (likeDiff !== 0) return likeDiff;
                    
                    // If likes are equal, sort by date (newest first)
                    if (a.createdAt && b.createdAt) {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return 0;
                  })
                  .map((post) => <Post key={post._id} post={post} />)
              ) : (
                <div className="text-center text-foreground/60 py-12 border border-dashed border-moradoclaro/30 rounded-lg">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-moradoclaro" />
                  <p className="text-lg font-medium">No hay publicaciones populares</p>
                  <p className="text-sm">¡Las publicaciones con más me gusta aparecerán aquí!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Mobile Create Post Button */}
        <MobileCreatePostButton onClick={openMobileDialog} />
        
        {/* Indicador de estado de conexión (opcional) */}
        <div className={`fixed bottom-4 left-4 h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Conectado en tiempo real' : 'Desconectado'}></div>
      </div>
    </div>
  );
};

export default SocialFeed;