import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/']
  
  // Define role-based protected routes
  const adminRoutes = ['/admin']
  const hrRoutes = ['/people', '/leave', '/attendance']
  const managerRoutes = ['/people', '/attendance', '/reports']
  const employeeRoutes = ['/attendance', '/leave']

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check role-based access
  const userRole = token.role as string

  // Admin routes - only ADMIN can access
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // HR routes - ADMIN and HR can access
  if (hrRoutes.some(route => pathname.startsWith(route))) {
    if (userRole !== 'ADMIN' && userRole !== 'HR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Manager routes - ADMIN, HR, and MANAGER can access
  if (managerRoutes.some(route => pathname.startsWith(route))) {
    if (userRole !== 'ADMIN' && userRole !== 'HR' && userRole !== 'MANAGER') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Employee routes - all roles can access
  if (employeeRoutes.some(route => pathname.startsWith(route))) {
    if (!['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // If all checks pass, allow access
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}