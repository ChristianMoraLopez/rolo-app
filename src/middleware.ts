import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get('currentUser')
  const authToken = request.cookies.get('auth_token')
 
  // Lista de rutas protegidas
  const protectedPaths = ['/bogotanos', '/addLocation']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Verify the user is authenticated - check both cookie and token
  let isAuthenticated = false
  
  if (currentUserCookie?.value && authToken?.value) {
    try {
      // Parse the cookie to verify it contains valid user data
      const userData = JSON.parse(currentUserCookie.value)
      isAuthenticated = !!userData && typeof userData === 'object' && !!authToken.value
      
      // Log auth status to debug (in development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] Authentication status:', isAuthenticated ? 'Authenticated' : 'Not authenticated')
        console.log('[Middleware] Path:', request.nextUrl.pathname)
      }
    } catch (error) {
      console.error('[Middleware] Error parsing user data:', error)
      isAuthenticated = false
    }
  }

  if (isProtectedPath && !isAuthenticated) {
    // Log the redirection (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Redirecting to login from:', request.nextUrl.pathname)
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/bogotanos/:path*', '/addLocation/:path*']
}