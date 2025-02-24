// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get('currentUser')
  
  // Lista de rutas protegidas
  const protectedPaths = ['/bogotanos', '/addLocation']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Verify the user is authenticated
  let isAuthenticated = false
  if (currentUserCookie?.value) {
    try {
      // Parse the cookie to verify it contains valid user data
      const userData = JSON.parse(currentUserCookie.value)
      isAuthenticated = !!userData && typeof userData === 'object'
    } catch (error) {
      
      console.error('Error parsing user data:', error)
      isAuthenticated = false
    }
  }

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/bogotanos/:path*', '/addLocation/:path*']
}