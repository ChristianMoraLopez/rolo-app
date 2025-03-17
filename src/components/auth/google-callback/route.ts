// src/app/api/auth/google-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/config/api';

export async function GET(request: NextRequest) {
  // Obtener el código de autorización y state de la URL
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/';
  const error = searchParams.get('error');

  // Si hay un error en la autenticación
  if (error) {
    console.error('Error en autenticación de Google:', error);
    return NextResponse.redirect(new URL(`/?auth_error=${error}`, request.url));
  }

  // Si no hay código de autorización
  if (!code) {
    console.error('No se recibió código de autorización de Google');
    return NextResponse.redirect(new URL('/?auth_error=no_code', request.url));
  }

  try {
    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch(`${API_URL}/auth/google-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Error en intercambio de código: ${tokenResponse.status}`);
    }

    // Obtener el token y datos de usuario
    const authData = await tokenResponse.json();

    // Guardar token en cookie segura (httpOnly)
    const response = NextResponse.redirect(new URL(state, request.url));
    
    // Configurar cookie segura con el token
    response.cookies.set({
      name: 'auth_token',
      value: authData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return response;
  } catch (error) {
    console.error('Error procesando callback de Google:', error);
    return NextResponse.redirect(new URL('/?auth_error=server_error', request.url));
  }
}