"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Toaster } from "sonner";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/hooks/useAuth";



const inter = Inter({ subsets: ["latin"] });

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
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider> 
          <ChakraProvider value={defaultSystem}>
            <main className="min-h-screen bg-background text-foreground">
              <Navbar />
              {children}
            </main>
            <Toaster />
          </ChakraProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </body>
  </html>
  );
}
