'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { FaGoogle, FaSpotify } from 'react-icons/fa';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        toast.success('Has iniciado sesión correctamente');
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error al iniciar sesión con Google');
      } else {
        toast.error('Error al iniciar sesión con Google');
      }
      setIsLoading(false);
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Error de autenticación:', error);
        toast.error(`Error: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión con Spotify');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // La redirección se manejará automáticamente por el event listener en la página de login
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error al iniciar sesión');
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            {error && (
              <div className='text-sm text-red-500 font-medium'>{error}</div>
            )}
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                placeholder='Enter your email'
                type='email'
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                placeholder='Enter your password'
                type='password'
                required
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </div>
        </form>
        <div className='relative my-4'>
          <Separator />
          <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground'>
            OR
          </span>
        </div>
        <div className='grid gap-2'>
          <Button
            variant='outline'
            className='w-full'
            onClick={handleGoogleLogin}
          >
            <FaGoogle className='mr-2 h-4 w-4' />
            Login with Google
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={handleSpotifyLogin}
            disabled={isLoading}
          >
            <FaSpotify className='mr-2 h-4 w-4' />
            {isLoading ? 'Conectando...' : 'Login with Spotify'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Link href='/auth/reset-password'>
          <Button variant='ghost'>Forgot password?</Button>
        </Link>
      </CardFooter>
      <CardFooter>
        <Link href='/auth/signup'>
          <Button variant='ghost'>Without an account? Sign up!</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
