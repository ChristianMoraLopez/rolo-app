"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Importa el hook useAuth
import { dashboardService, DashboardStats } from '@/hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, MapPin, Activity, 
  TrendingUp, 
  Bell, Settings, Filter
} from 'lucide-react';
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, protectRoute } = useAuth(); // Usa el hook useAuth
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {

    console.log('User:', user); // Verifica el usuario
    // Verifica si el usuario es admin usando protectRoute
    if (!protectRoute('admin', '/bogotanos')) {
      return;
    }
  }, [protectRoute]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await dashboardService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('No se pudieron cargar las estadísticas');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (authLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  // El protectRoute ya maneja la redirección, pero por seguridad:
  if (!user || user.role !== 'admin') {
    return null;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-moradoclaro/5">
      {/* Header section remains the same */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-6 h-6 text-azulprimary" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{dashboardStats?.totalUsers || 0}</p>
                <p className="text-sm text-foreground/60">
                  <span className="text-verdeprimary">
                    {dashboardStats?.activeUsers || 0} activos
                  </span> · {(dashboardStats?.totalUsers || 0) - (dashboardStats?.activeUsers || 0)} inactivos
                </p>
                <div className="h-1 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-azulprimary rounded-full" 
                    style={{ 
                      width: `${dashboardStats?.activeUsers && dashboardStats?.totalUsers 
                        ? (dashboardStats.activeUsers / dashboardStats.totalUsers) * 100 
                        : 0}%` 
                    }}
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

          {/* Locations Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-6 h-6 text-verdeprimary" />
                Ubicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardStats?.totalLocations || 0}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10"
                onClick={() => router.push('/admin/locations')}
              >
                Ver Ubicaciones
              </Button>
            </CardFooter>
          </Card>

          {/* Posts Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6 text-moradoprimary" />
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardStats?.totalPosts || 0}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10"
                onClick={() => router.push('/admin/posts')}
              >
                Ver Posts
              </Button>
            </CardFooter>
          </Card>

          {/* Comments Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-6 h-6 text-azulsecundario" />
                Comentarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardStats?.totalComments || 0}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-moradoclaro/20 hover:bg-moradoclaro/10"
                onClick={() => router.push('/admin/comments')}
              >
                Ver Comentarios
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {dashboardStats?.recentActivity && (
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
                  <LineChart data={dashboardStats.recentActivity}>
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
          )}
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