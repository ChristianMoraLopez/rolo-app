"use client"

import SocialFeed from '@/components/features/SocialFeed';

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="py-4">
        <h1 className="text-2xl font-bold text-center text-foreground mb-6">
          Descubre Bogotá
        </h1>
        <SocialFeed />
      </div>
    </main>
  )
}