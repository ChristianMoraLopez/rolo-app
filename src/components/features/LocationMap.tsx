// src/components/features/LocationMap.tsx
'use client';
import dynamic from 'next/dynamic';
import { Card } from "@/components/ui/card";

// Importamos el mapa dinámicamente para evitar problemas de SSR
const Map = dynamic(() => import('@/components/features/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-azulreducido/20 animate-pulse rounded-lg" />
  )
});

export function LocationMap() {
  return (
    <Card className="mb-12">
      <div className="h-[400px] rounded-lg overflow-hidden">
        <Map />
      </div>
    </Card>
  );
}