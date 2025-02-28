// src/core/entities/types.ts (parcial)

export type AuthProvider = 'email' | 'google';

export type Role = 'visitor' | 'registered' | 'subscriber' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; 
  role: Role;
  avatar?: string;
  location?: string; 
  authProvider: AuthProvider;
  googleId?: string;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  sensations: string[];
  smells: string[];
  images: { src: string; width: number; height: number }[];
  createdAt: Date;
  createdBy: User;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
  locationId: string;
}

// Nuevo tipo PostAuthor que extiende de User pero solo incluye los campos necesarios para la vista
export type PostAuthor = Pick<User, '_id' | 'name' | 'avatar'> & {
  location: string; // Localidad en Bogotá
};

// Tipo para los comentarios modificado
export type PostComment = {
  _id: string; // ID del comentario
  author: PostAuthor; // Autor del comentario (referencia)
  authorName?: string; // Nombre del autor como string
  content: string; // Contenido del comentario
  createdAt: Date; // Fecha de creación
};

// Tipo principal para el post modificado
export interface PostType {
  _id: string; // ID del post
  title: string; // Título del post
  content: string; // Contenido del post
  author: PostAuthor; // Autor del post (referencia)
  authorName?: string; // Nombre del autor como string
  image?: string; // URL de la imagen (opcional)
  location?: string; // ID de la ubicación asociada al post (opcional)
  locationName?: string; // Nombre de la ubicación como string
  likes: number; // Número de likes
  likedBy?: string[]; // IDs de usuarios que dieron like (opcional)
  comments: number; // Número de comentarios
  commentsList?: PostComment[]; // Lista de comentarios (opcional)
  createdAt: Date; // Fecha de creación del post
  shared?: number; // Número de veces que se compartió el post (opcional)
  liked?: boolean; // Indica si el usuario actual dio like (opcional)
}