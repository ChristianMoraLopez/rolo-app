//src\components\features\SocialFeed.tsx

"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PostType } from '@/core/entities/types';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, UserCircle2, MapPin, Image as ImageIcon, X, PlusCircle, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/core/services/post';
import { motion, AnimatePresence } from 'framer-motion';
// Import the shared socket instance
import socket from '@/lib/socket'; 

// Enhanced Post component with comments functionality
const Post = ({ post }: { post: PostType }) => {
  // Rest of the Post component remains unchanged
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();
  
  // Función para manejar el like de un post
  const handleLike = async () => {
    try {
      await postService.likePost(post._id);
      
      // Actualizar UI inmediatamente (optimistic update)
      // La actualización real vendrá a través del socket
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error al dar like al post:', error);
      // Revertir cambios optimistas en caso de error
      setLiked(liked);
      setLikeCount(post.likes || 0);
    }
  };
  
  // Función para enviar un comentario
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      await postService.commentPost(post._id, commentText);
      
      // Limpiar el campo después de enviar
      setCommentText('');
      // El socket manejará la actualización del contador de comentarios
    } catch (error) {
      console.error('Error al comentar el post:', error);
    } finally {
      setIsSubmittingComment(false);
    }
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
              <div className="font-semibold text-foreground text-lg">{post.author?.name || 'Usuario desconocido'}</div>
              <div className="flex items-center text-sm text-foreground/60">
                <MapPin className="mr-1 h-3 w-3" />
                {post.author?.location || 'Ubicación desconocida'}
                <span className="mx-2">•</span>
                <span className="text-xs">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString('es-CO', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'hace unos momentos'}
                </span>
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
        <CardFooter className="border-t border-moradoclaro/20 pt-4 flex flex-col">
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
              onClick={() => setShowComments(!showComments)}
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
          
          {/* Sección de comentarios */}
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-4 border-t border-moradoclaro/20 pt-4"
            >
              {/* Formulario para añadir comentario */}
              <form onSubmit={handleSubmitComment} className="flex items-center space-x-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback>
                    <UserCircle2 className="h-8 w-8 text-moradoprimary" />
                  </AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[40px] text-sm resize-none flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {/* Aquí se mostrarían los comentarios si tienes la información */}
              <div className="text-center text-sm text-foreground/60 py-4">
                <p>Los comentarios se mostrarían aquí</p>
                <p className="text-xs">Para implementar completamente esta funcionalidad, necesitarías crear un endpoint que devuelva los comentarios para cada post.</p>
              </div>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Other components remain unchanged
interface PostData {
  title: string; 
  content: string;
  image?: File; 
  author?: string;
  location?: string;
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
  // Component content remains unchanged
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
                <AvatarImage src={user?.avatar || ""} />
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
              <AvatarImage src={user?.avatar || ""} />
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

const SocialFeed = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('todos');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newPostNotification, setNewPostNotification] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [temporaryNewPosts, setTemporaryNewPosts] = useState<PostType[]>([]);
  const [socketStatus, setSocketStatus] = useState<string>('Desconectado');

  // Función para cargar posts
  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await postService.getPosts();
      const sortedPosts = [...fetchedPosts].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
      setPosts(sortedPosts);
      setTemporaryNewPosts([]);
      setNewPostsCount(0);
      setNewPostNotification(false);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  }, []);

  useEffect(() => {
    // Cargar posts al iniciar
    fetchPosts();

    // Monitor connection status changes
    const handleConnect = () => {
      console.log('Conectado al servidor de WebSockets');
      setIsConnected(true);
      setSocketStatus('Conectado');
    };

    const handleDisconnect = () => {
      console.log('Desconectado del servidor de WebSockets');
      setIsConnected(false);
      setSocketStatus('Desconectado');
    };

    const handleConnectError = (error: Error) => {
      console.error('Error de conexión WebSocket:', error);
      setSocketStatus('Error de conexión');
    };

    // Event listeners
    const handleNewPost = (newPost: PostType) => {
      console.log('Nuevo post recibido:', newPost);
      
      setPosts(currentPosts => {
        if (currentPosts.some(post => post._id === newPost._id)) {
          return currentPosts;
        }
        
        if (window.scrollY < 100) {
          return [newPost, ...currentPosts];
        } else {
          setTemporaryNewPosts(prev => [newPost, ...prev]);
          setNewPostsCount(prev => prev + 1);
          setNewPostNotification(true);
          return currentPosts;
        }
      });
    };

    const handleUpdatePost = (updatedPost: PostType) => {
      console.log('Post actualizado recibido:', updatedPost);
      
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      
      setTemporaryNewPosts(currentPosts => 
        currentPosts.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new_post', handleNewPost);
    socket.on('update_post', handleUpdatePost);

    // Function to send a ping to the server periodically to keep the connection alive
    const pingServer = () => {
      if (socket.connected) {
        socket.emit('client_message', { type: 'ping', message: 'Ping desde el cliente' });
      }
    };

    // Set up ping interval
    const pingInterval = setInterval(pingServer, 30000); // 30 seconds

    // Update initial connection status
    setIsConnected(socket.connected);
    setSocketStatus(socket.connected ? 'Conectado' : 'Desconectado');

    // Clean up function
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new_post', handleNewPost);
      socket.off('update_post', handleUpdatePost);
      clearInterval(pingInterval);
    };
  }, [fetchPosts]);

  // Manejar la creación de un nuevo post
  const handleCreatePost = useCallback(async (postData: PostData) => {
    try {
      await postService.createPost(postData);
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw error;
    }
  }, []);

  // Función para cargar nuevos posts
  const loadNewPosts = useCallback(() => {
    setPosts(currentPosts => [...temporaryNewPosts, ...currentPosts]);
    setTemporaryNewPosts([]);
    setNewPostsCount(0);
    setNewPostNotification(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [temporaryNewPosts]);

  // Funciones para reconectar en caso de desconexión
  const reconnect = useCallback(() => {
    if (!isConnected) {
      setSocketStatus('Reconectando...');
      socket.connect();
    }
  }, [isConnected]);

  // Function to sort posts by date (newest first)
  const getSortedPosts = useCallback((postsToSort: PostType[]) => {
    return [...postsToSort].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return String(b._id).localeCompare(String(a._id));
    });
  }, []);

  const openMobileDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

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
        
        {/* Indicador de estado de conexión con el texto de estado */}
        <div className="fixed bottom-4 left-4 flex items-center space-x-2 bg-background/80 backdrop-blur-sm py-1 px-3 rounded-full shadow-sm border border-moradoclaro/30">
          <div 
            className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
            title={isConnected ? 'Conectado en tiempo real' : 'Desconectado'}
          ></div>
          <span className="text-xs text-foreground/70">{socketStatus}</span>
          {!isConnected && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs px-2 py-0 ml-1" 
              onClick={reconnect}
            >
              Reconectar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;