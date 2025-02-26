'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X, Music } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previousAuthState = useRef(false);
  const router = useRouter();
  const supabase = createClient();

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }, [supabase.auth]);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const newAuthState = !!session;

      // Mostramos alertas si hubo un cambio de estado
      if (newAuthState !== previousAuthState.current) {
        if (event === 'SIGNED_IN' && !previousAuthState.current) {
          toast.success('Has iniciado sesión correctamente');
        } else if (event === 'SIGNED_OUT' && previousAuthState.current) {
          toast.success('Has cerrado sesión correctamente');
        }
        previousAuthState.current = newAuthState;
      }

      setIsAuthenticated(newAuthState);
    });

    return () => subscription.unsubscribe();
  }, [checkAuth, supabase.auth]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push('/');
    } catch (error: unknown) {
      toast.error(
        `Error al cerrar sesión: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const currentPath = window.location.pathname;

      // Redirigimos a la ruta raíz
      await router.push('/');

      // Recargamos si ya estamos en / para forzar la recarga de la página después de una request
      if (currentPath === '/') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al navegar:', error);
      toast.error('Error al navegar a la página principal');
    }
  };

  return (
    <header className='fixed w-full bg-[#1E1F20] z-50 transition-all duration-300 ease-in-out'>
      <nav className='container mx-auto px-4 h-16 flex items-center mt-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center' onClick={handleLogoClick}>
          <Music className='w-8 h-8 text-green-500 transition-transform duration-200 hover:scale-105' />
          <span className='ml-2 text-xl font-bold text-green-500 hidden sm:block' />
        </Link>

        {/* Auth buttons */}
        <div className='flex items-center space-x-4 ml-auto'>
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <Button
                variant='ghost'
                className='text-gray-300 font-bold transition-colors duration-200'
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            ) : (
              <>
                <Link href='/auth/login'>
                  <Button
                    variant='ghost'
                    className='text-gray-300 font-bold transition-colors duration-200 hover:text-green-600'
                  >
                    Login
                  </Button>
                </Link>
                <Link href='/auth/signup'>
                  <Button
                    className='bg-green-600 hover:bg-green-700 font-bold transition-all duration-200 
                             hover:scale-105 active:scale-95'
                  >
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            type='button'
            className='md:hidden text-gray-300'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil con transición */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {isMenuOpen && (
          <div className='container mx-auto px-4 py-4 flex flex-col space-y-4'>
            {isAuthenticated ? (
              <Button
                variant='ghost'
                className='w-full justify-center text-gray-300 font-bold'
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href='/auth/login'>
                  <Button
                    variant='ghost'
                    className='w-full justify-center text-gray-300 font-bold'
                  >
                    Login
                  </Button>
                </Link>
                <Link href='/auth/signup'>
                  <Button className='w-full justify-center bg-green-600 hover:bg-green-700 font-bold'>
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
