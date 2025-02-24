import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/core/entities/types';
import { authService } from '@/core/services/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Definir la interfaz AuthResponse para que coincida con el servicio
interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Actualizado: ahora devuelve Promise<AuthResponse>
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  googleLogin: (token: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('token');
        console.log('storedUser:', storedUser);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          
        } else {
          setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setUser(null); // Asegúrate de establecer el usuario como null en caso de error
      } finally {
        setLoading(false);
      }
    };
  
    loadUser();
    window.addEventListener('storage', loadUser);
    
    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const setUserData = (userData: User) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Establecer cookie para el middleware
    document.cookie = `currentUser=${JSON.stringify(userData)}; path=/; max-age=86400`;
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response); // Add this line
      setUserData(response.user);
      localStorage.setItem('token', response.token); 
      toast.success('¡Bienvenido de nuevo!');
      return response;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error en el inicio de sesión');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
        const response = await authService.register(email, password, name);
        setUserData(response.user); 
        toast.success('¡Registro exitoso! Bienvenido a Rolo App');
        return response;
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error en el registro');
        throw error;
    }
};

  const googleLogin = async (token: string): Promise<AuthResponse> => {
    try {
      const response = await authService.googleLogin(token);
      setUserData(response.user);
      toast.success('¡Inicio de sesión con Google exitoso!');
      return response;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error en el inicio de sesión con Google');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    // Eliminar cookie
    document.cookie = 'currentUser=; path=/; max-age=0';
    setUser(null);
    toast.success('¡Hasta pronto!');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};