import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  const authCookie = request.cookies.get('mr_burro_auth')?.value

  // Public paths that do not require authentication
  const publicPaths = ['/login', '/_next', '/favicon.ico', '/api']
  
  // Check if current path starts with any of the public paths
  const isPublicPath = publicPaths.some(path => currentPath.startsWith(path))

  if (!authCookie && !isPublicPath) {
    // Redirect unauthenticated user to login page
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (authCookie && currentPath === '/login') {
    // Redirect authenticated user away from login page
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
