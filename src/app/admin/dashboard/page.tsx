"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/core/entities/types';
import { mockUsers } from '@/infrastructure/mocks/data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, MapPin, Activity, LogOut, 
  TrendingUp, AlertTriangle, CheckCircle,
  Bell, Settings, Search, Filter
} from 'lucide-react';
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';

// Mock data for the activity chart
const activityData = [
  { date: '01/02', users: 4, locations: 2, comments: 5 },
  { date: '02/02', users: 6, locations: 3, comments: 8 },
  { date: '03/02', users: 8, locations: 4, comments: 12 },
  { date: '04/02', users: 7, locations: 5, comments: 10 },
  { date: '05/02', users: 9, locations: 6, comments: 15 },
  { date: '06/02', users: 11, locations: 7, comments: 18 },
  { date: '07/02', users: 13, locations: 8, comments: 20 },
];

// Mock notifications
const notifications = [
  { id: 1, type: 'warning', message: 'Usuario reportado: Contenido inapropiado', time: '2min' },
  { id: 2, type: 'success', message: 'Nueva ubicación verificada', time: '5min' },
  { id: 3, type: 'info', message: 'Actualización del sistema programada', time: '15min' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/bogotanos');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalUsers = mockUsers.length;
  const activeUsers = Math.floor(totalUsers * 0.75);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('storage'));
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-moradoclaro/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-moradoclaro/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-azulprimary via-moradoprimary to-azulsecundario bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus:ring-0 w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rojoprimary text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3">
                      <div className="flex items-start gap-3">
                        {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-rojoprimary" />}
                        {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-verdeprimary" />}
                        {notification.type === 'info' && <Bell className="w-5 h-5 text-azulprimary" />}
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">Hace {notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/settings')}
                className="hidden md:flex"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-rojoprimary hover:text-rojohover hover:bg-rojoprimary/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-6 h-6 text-azulprimary" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{totalUsers}</p>
                <p className="text-sm text-foreground/60">
                  <span className="text-verdeprimary">{activeUsers} activos</span> · {totalUsers - activeUsers} inactivos
                </p>
                <div className="h-1 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-azulprimary rounded-full" 
                    style={{ width: `${(activeUsers/totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10"
                onClick={() => router.push('/admin/users')}
              >
                Ver Detalles
              </Button>
            </CardFooter>
          </Card>

          {/* Similar enhanced styling for other stat cards */}
          {/* ... */}
        </div>

        {/* Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-moradoprimary" />
                  Actividad Reciente
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      {selectedTimeRange === '7d' ? 'Última semana' : 'Último mes'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedTimeRange('7d')}>
                      Última semana
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedTimeRange('30d')}>
                      Último mes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#0D3ADB" strokeWidth={2} />
                  <Line type="monotone" dataKey="locations" stroke="#96E600" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="#AD00E6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6 text-azulsecundario" />
                Últimas Acciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity items */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-verdeprimary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-verdeprimary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nueva ubicación agregada</p>
                    <p className="text-xs text-gray-500">Hace 5 minutos</p>
                  </div>
                </div>
                {/* More activity items... */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm border border-moradoclaro/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              className="bg-gradient-to-r from-azulprimary to-azulsecundario hover:from-azulhover hover:to-azulsechover text-white"
              onClick={() => router.push('/admin/users/new')}
            >
              <Users className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
            <Button
              className="bg-gradient-to-r from-verdeprimary to-verdehover hover:from-verdesaturado hover:to-verdelight text-white"
              onClick={() => router.push('/admin/locations/new')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Agregar Ubicación
            </Button>
            <Button
              className="bg-gradient-to-r from-moradoprimary to-moradoclaro hover:from-moradohover hover:to-moradosaturado text-white"
              onClick={() => router.push('/admin/reports')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Ver Reportes
            </Button>
            <Button
              className="bg-gradient-to-r from-azulsecundario to-azulsecundarioclaro hover:from-azulsechover hover:to-azulsecundariosaturado text-white"
              onClick={() => router.push('/admin/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}