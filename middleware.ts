import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/api']

// Routes that are only for unauthenticated users (redirect to dashboard if logged in)
const AUTH_ONLY_PREFIXES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  // Refresh the session cookie (Supabase SSR requirement)
  const response = await updateSession(request)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
