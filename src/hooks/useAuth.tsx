//src\hooks\useAuth.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/core/entities/types';
import { authService } from '@/core/services/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 

interface AuthResponse {
  user: User;
  token: string;
}

interface AdditionalData {
  authProvider?: string;
  role?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string, additionalData: AdditionalData) => Promise<AuthResponse>;
  googleLogin: (token: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  setUserData: (userData: User, token: string) => void; // Añade esta línea
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Función para guardar datos de usuario de manera consistente
  const setUserData = (userData: User, token: string) => {
    try {
      // Primero almacena el token
      localStorage.setItem('token', token);
      
      // Luego guarda el usuario usando JSON.stringify de manera segura
      const userJson = JSON.stringify(userData);
      localStorage.setItem('currentUser', userJson);
      
      // Establecer la cookie correctamente para que sea accesible por el middleware
      // Usar js-cookie para configurar la cookie de manera adecuada
      Cookies.set('currentUser', userJson, { 
        path: '/', 
        expires: 1, // 1 day
        sameSite: 'lax' 
      });
      
      // Establecer también el token en la cookie para el middleware
      Cookies.set('auth_token', token, { 
        path: '/', 
        expires: 1, // 1 day
        sameSite: 'lax' 
      });
      
      // Finalmente actualiza el estado
      setUser(userData);
      
      console.log('Usuario y token guardados correctamente (localStorage y cookies)');
    } catch (error) {
      console.error('Error al guardar datos de usuario:', error);
      toast.error('Error al guardar los datos de sesión');
    }
  };

  // En tu useEffect para cargar el usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('token');
        const cookieUser = Cookies.get('currentUser');
        
        console.log('Verificando datos almacenados:');
        console.log('- Usuario localStorage:', storedUser ? 'Presente' : 'No encontrado');
        console.log('- Usuario cookie:', cookieUser ? 'Presente' : 'No encontrado');
        console.log('- Token almacenado:', storedToken ? 'Presente (oculto por seguridad)' : 'No encontrado');
        
        // Si hay información en cookies pero no en localStorage, sincronizar
        if (cookieUser && !storedUser) {
          localStorage.setItem('currentUser', cookieUser);
        }
        
        // Si hay info en localStorage pero no en cookies, sincronizar
        if (storedUser && !cookieUser) {
          Cookies.set('currentUser', storedUser, { 
            path: '/', 
            expires: 1,
            sameSite: 'lax' 
          });
        }
        
        // Si solo hay token pero no usuario, intenta recuperar los datos del usuario
        if (!storedUser && storedToken) {
          console.log('Detectado token sin usuario, intentando recuperar información del usuario...');
          try {
            // Implementa una función para obtener el usuario con el token
            const userData = await authService.getUserProfile(storedToken);
            if (userData) {
              console.log('Usuario recuperado correctamente');
              // Usar la función centralizada para establecer todos los datos
              setUserData(userData, storedToken);
            }
          } catch (recoverError) {
            console.error('No se pudo recuperar el usuario, limpiando token:', recoverError);
            localStorage.removeItem('token');
            Cookies.remove('auth_token');
          }
        } else if(storedUser && storedToken) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Asegurar que las cookies estén actualizadas
            Cookies.set('currentUser', storedUser, { 
              path: '/', 
              expires: 1,
              sameSite: 'lax' 
            });
            Cookies.set('auth_token', storedToken, { 
              path: '/', 
              expires: 1,
              sameSite: 'lax' 
            });
            
            console.log('Usuario cargado correctamente:', parsedUser.name || parsedUser.email);
          } catch (parseError) {
            console.error('Error al analizar el usuario almacenado:', parseError);
            // Limpieza de datos inválidos
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            Cookies.remove('currentUser');
            Cookies.remove('auth_token');
            setUser(null);
          }
        } else {
          console.log('No se encontraron datos de sesión válidos');
          setUser(null);
        }
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        Cookies.remove('currentUser');
        Cookies.remove('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    // Escucha cambios en localStorage desde otras pestañas
    window.addEventListener('storage', loadUser);
    
    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  // Función de inicio de sesión simplificada y robusta
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Intentando iniciar sesión con:', email);
      
      const response = await authService.login(email, password);
      
      console.log('Respuesta del servicio de autenticación recibida');
      
      if (!response || !response.user || !response.token) {
        console.error('Respuesta de inicio de sesión incompleta:', response);
        throw new Error('La respuesta del servidor no contiene los datos necesarios');
      }
      
      // Usar la función centralizada para establecer los datos del usuario
      setUserData(response.user, response.token);
      
      toast.success('¡Bienvenido de nuevo!');
      return response;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      toast.error(error instanceof Error ? error.message : 'Error en el inicio de sesión');
      throw error;
    }
  };


  

  const register = async (
    email: string,
    password: string,
    name: string,
    additionalData: AdditionalData = {}
  ): Promise<AuthResponse> => {
    try {
      console.log('Intentando registrar usuario:', email);
  
      const response = await authService.register(email, password, name, additionalData);
  
      if (!response || !response.user || !response.token) {
        console.error('Respuesta de registro incompleta:', response);
        throw new Error('La respuesta del servidor no contiene los datos necesarios');
      }
  
      setUserData(response.user, response.token);
      toast.success('¡Registro exitoso! Bienvenido a Rolo App');
      return response;
    } catch (error) {
      console.error('Error de registro:', error);
      toast.error(error instanceof Error ? error.message : 'Error en el registro');
      throw error;
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const googleLogin = async (token: string): Promise<AuthResponse> => {
    try {
      console.log('Intentando iniciar sesión con Google');
      
      const response = await authService.googleLogin(token);
      
      if (!response || !response.user || !response.token) {
        console.error('Respuesta de inicio de sesión con Google incompleta:', response);
        throw new Error('La respuesta del servidor no contiene los datos necesarios');
      }
      
      setUserData(response.user, response.token);
      toast.success('¡Inicio de sesión con Google exitoso!');
      return response;
    } catch (error) {
      console.error('Error de inicio de sesión con Google:', error);
      toast.error(error instanceof Error ? error.message : 'Error en el inicio de sesión con Google');
      throw error;
    }
  };

  const logout = () => {
    try {
      console.log('Cerrando sesión...');
      
      // Eliminar datos de localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      
      // Eliminar cookies correctamente
      Cookies.remove('currentUser');
      Cookies.remove('auth_token');
      
      // Actualizar estado
      setUser(null);
      
      toast.success('¡Hasta pronto!');
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
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
        setUserData 
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