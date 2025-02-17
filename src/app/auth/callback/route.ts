import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.hash ? new URLSearchParams(requestUrl.hash.substring(1)).get('error_description') : null;

  // Si hay un error en la URL, redirigir con el mensaje
  if (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error)}`
    );
  }

  try {
    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Code error:', sessionError);
        throw sessionError;
      }
    }

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Error processing authentication')}`
    );
  }
}