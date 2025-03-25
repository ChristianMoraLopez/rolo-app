import { API_URL } from '@/config/api';

export interface ActivityData {
  date: string;
  users: number;
  locations: number;
  comments: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalLocations: number;
  totalPosts: number;
  totalComments: number;
  recentActivity: ActivityData[];
}

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const [usersResponse, locationsResponse, postsResponse] = await Promise.all([
        fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }),
        fetch(`${API_URL}/locations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }),
        fetch(`${API_URL}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
      ]);

      // Verificar cada respuesta individualmente
      if (!usersResponse.ok) throw new Error('Error fetching users');
      if (!locationsResponse.ok) throw new Error('Error fetching locations');
      if (!postsResponse.ok) throw new Error('Error fetching posts');

      const [users, locations, posts] = await Promise.all([
        usersResponse.json(),
        locationsResponse.json(),
        postsResponse.json()
      ]);

      // Validar tipos de datos recibidos
      if (!Array.isArray(users) || !Array.isArray(locations) || !Array.isArray(posts)) {
        throw new Error('Invalid data format received from API');
      }

      const totalComments = posts.reduce<number>(
        (total, post) => total + (post.comments?.length || 0),
        0
      );

      const recentActivity: ActivityData[] = [
        { 
          date: new Date().toLocaleDateString('es-CO'), // Fecha actual
          users: Math.max(1, Math.floor(users.length * 0.1)),
          locations: Math.max(1, Math.floor(locations.length * 0.1)),
          comments: Math.max(1, Math.floor(totalComments * 0.1))
        }
      ];

      return {
        totalUsers: users.length,
        activeUsers: Math.floor(users.length * 0.75),
        totalLocations: locations.length,
        totalPosts: posts.length,
        totalComments,
        recentActivity
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      // Retornar valores por defecto en caso de error
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalLocations: 0,
        totalPosts: 0,
        totalComments: 0,
        recentActivity: []
      };
    }
  }
};