'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import Link from 'next/link';
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
import { signup } from '../auth/signup/actions';
import { createClient } from '../utils/supabase/client';

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  const handleSpotifySignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  async function handleSubmit(formData: FormData) {
    setError(null); // Limpiar error previo

    const result = await signup(formData);

    if (!result) return;

    if (result.error) {
      setError(result.error);
      return;
    }

    if ('success' in result && 'redirect' in result) {
      router.push(result.redirect as string);
    }
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            {error && (
              <div className='text-sm text-red-500 font-medium'>{error}</div>
            )}
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter your name'
                required
              />
            </div>
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
                placeholder='Create a password'
                type='password'
                required
              />
            </div>
            <Button type='submit'>Sign Up</Button>
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
            onClick={handleGoogleSignup}
          >
            <FaGoogle className='mr-2 h-4 w-4' />
            Sign up with Google
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={handleSpotifySignup}
          >
            <FaSpotify className='mr-2 h-4 w-4' />
            Sign up with Spotify
          </Button>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <Link href='/auth/login'>
          <Button variant='ghost'>Already have an account?</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
