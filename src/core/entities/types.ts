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

// Nuevo tipo Post
export interface Post {
  id: string;
  title: string;
  author: PostAuthor;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  location?: Location; // Referencia opcional a una ubicación
  liked?: boolean;     // Estado de si el usuario actual dio like
  shared?: number;     // Número de veces compartido
}