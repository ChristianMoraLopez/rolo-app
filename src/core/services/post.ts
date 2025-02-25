import { API_URL } from '@/config/api';
import { PostType } from '@/core/entities/types';

export const postService = {
  // Obtener todos los posts
  getPosts: async (): Promise<PostType[]> => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los posts');
      }

      return response.json();
    } catch (error) {
      console.error('Error en postService.getPosts:', error);
      throw error;
    }
  },

  // Crear un nuevo post
  createPost: async (postData: {
    title: string;
    content: string;
    image?: File;
    location?: string;
  }): Promise<PostType> => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('title', postData.title);
      formData.append('content', postData.content);
      if (postData.image) {
        formData.append('image', postData.image); // Añade la imagen al FormData
      }
      if (postData.location) {
        formData.append('location', postData.location);
      }

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear el post');
      }

      return response.json();
    } catch (error) {
      console.error('Error en postService.createPost:', error);
      throw error;
    }
  },
};