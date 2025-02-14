"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="images/bogota.png" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}