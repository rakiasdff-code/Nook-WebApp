import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/home', '/bookshelf', '/my-nook', '/explore', '/connect']

// Rutas de autenticación (si ya estás autenticado, redirect a /home)
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Por ahora, el middleware solo redirige basándose en la URL
  // La verificación real de autenticación se hace en el cliente con el AuthContext
  
  // Si la ruta está protegida y no hay token, ir a login
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  if (isProtectedRoute) {
    // En producción, verificarías el token aquí
    // Por ahora, dejamos que el cliente maneje la autenticación
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

