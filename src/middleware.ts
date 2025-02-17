import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Lista de rutas públicas
  const publicRoutes = ['/', '/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Si está autenticado e intenta acceder a páginas de auth, redirigir a home
  if (session && (req.nextUrl.pathname.startsWith('/auth/'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Si no está autenticado y la ruta no es pública, redirigir a login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};