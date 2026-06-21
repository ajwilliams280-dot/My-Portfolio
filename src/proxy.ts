import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Strip trailing periods from URL path to prevent 404s from copy-pasting sentence-ending dots
  if (url.pathname.endsWith('.')) {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url);
  }
  
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - all images (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
