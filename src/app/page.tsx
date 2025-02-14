// src/app/page.tsx
import { Welcome } from '@/components/features/Welcome';
import { LocationMap } from '@/components/features/LocationMap';
import { FeaturedLocations } from '@/components/features/FeaturedLocations';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-azulclaro/5">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Welcome />
        <div className="relative">
          
          <LocationMap />
        </div>
        <FeaturedLocations />
      </div>
    </main>
  );
}