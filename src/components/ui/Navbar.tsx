'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, UserCircle2, LogOut, Compass, Users, MapPin } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react'

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Efecto para manejar el scroll
  useEffect(() => {
    // Verifica si estamos en el cliente antes de usar `window`
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
  };

  const NavLink: React.FC<NavLinkProps> = ({ href, children, icon: Icon }) => (
    <Link 
      href={href}
      className="relative flex items-center text-foreground/70 transition-all duration-300 hover:text-moradoprimary group"
      onClick={() => setIsSheetOpen(false)}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 md:hidden lg:block" />}
      <span className="text-sm">{children}</span>
      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-moradoprimary to-azulsecundario transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
    </Link>
  )

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-moradoclaro/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 md:h-20 items-center  px-4 md:px-6">
        <div className="flex items-center flex-1">
          
          <Link 
            href="/" 
            className="flex items-center space-x-2  pl-16 group mr-6 md:mr-12"
          >
            <Image
                src="/images/bogotabw.png"
                alt="Rolo App Logo"
                width={64}
                height={64}
                className="h-12 w-12 md:h-16 md:w-16 transition-transform duration-300 group-hover:scale-110 filter hover:brightness-75"
              />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
              Rolo App
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink href="/explore" icon={Compass}>Explorar</NavLink>
            {isAuthenticated && (
              <>
                <NavLink href="/bogotanos" icon={Users}>Bogotanos</NavLink>
                <NavLink href="/addLocation" icon={MapPin}>Agregar Ubicación</NavLink>
              </>      
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2 md:space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 md:gap-4">
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard"
                    className="text-sm text-foreground/70 hover:text-moradoprimary transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 md:h-10 md:w-10 rounded-full"
                      aria-label="Menú de usuario"
                    >
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-offset-2 ring-moradoprimary/20 transition-all duration-300 hover:ring-moradoprimary">
                        <AvatarImage src={user?.avatar} alt={user.name} />
                        <AvatarFallback>
                          <UserCircle2 className="h-5 w-5 md:h-6 md:w-6 text-moradoprimary" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem className="font-semibold text-foreground">
                      {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-rojoprimary focus:text-rojoprimary cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="hidden md:flex text-foreground/70 hover:text-moradoprimary hover:bg-moradoclaro/10"
                >
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-moradoprimary to-azulsecundario hover:from-moradohover hover:to-azulsechover text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                className="md:hidden hover:bg-moradoclaro/10"
                size="icon"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5 text-foreground/70 hover:text-moradoprimary" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full max-w-xs border-l border-moradoclaro/10 bg-gradient-to-b from-background to-moradoclaro/5"
            >
              <SheetHeader>
                <SheetTitle>Menú de navegación</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-6 mt-6">
                <Link 
                  href="/explore" 
                  className="flex items-center text-foreground/60 transition-all duration-300 hover:text-moradoprimary text-base font-medium transform hover:translate-x-2"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Explorar
                </Link>
                {isAuthenticated && (
                  <Link 
                    href="/bogotanos" 
                    className="flex items-center text-foreground/60 transition-all duration-300 hover:text-moradoprimary text-base font-medium transform hover:translate-x-2"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Bogotanos
                  </Link>

                  
                )}

                {isAuthenticated && (
                  <Link 
                    href="/addLocation" 
                    className="flex items-center text-foreground/60 transition-all duration-300 hover:text-moradoprimary text-base font-medium transform hover:translate-x-2"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Agregar Ubicación
                  </Link>
                )}

                <div className="h-px bg-gradient-to-r from-moradoclaro/20 via-azulsecundario/20 to-moradoclaro/20" />
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-4 px-2">
                      <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-moradoprimary/20">
                        <AvatarImage src={user?.avatar} alt={user.name} />
                        <AvatarFallback>
                          <UserCircle2 className="h-6 w-6 text-moradoprimary" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground/80 font-medium">{user.name}</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin/dashboard"
                        className="flex items-center text-foreground/60 transition-all duration-300 hover:text-moradoprimary text-base font-medium transform hover:translate-x-2"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-rojoprimary hover:text-rojohover text-base font-medium transform hover:translate-x-2 transition-all duration-300"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center text-foreground/60 transition-all duration-300 hover:text-moradoprimary text-base font-medium transform hover:translate-x-2"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      href="/register" 
                      className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-moradoprimary to-azulsecundario px-4 text-sm font-medium text-white transition-all duration-300 hover:from-moradohover hover:to-azulsechover hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moradoprimary focus-visible:ring-offset-2"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}