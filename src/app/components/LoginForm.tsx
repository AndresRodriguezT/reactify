'use client';
import { useState } from 'react';
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
import { login } from '../auth/login/actions';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null); // Limpiar error previo

    const result = await login(formData);

    if (result?.error) {
      setError('Email o contraseña incorrectos');
      return;
    }
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
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
            <Button type='submit'>Login</Button>
          </div>
        </form>
        <div className='relative my-4'>
          <Separator />
          <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground'>
            OR
          </span>
        </div>
        <div className='grid gap-2'>
          <Button variant='outline' className='w-full'>
            <FaGoogle className='mr-2 h-4 w-4' />
            Login with Google
          </Button>
          <Button variant='outline' className='w-full'>
            <FaSpotify className='mr-2 h-4 w-4' />
            Login with Spotify
          </Button>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='ghost'>Forgot password?</Button>
      </CardFooter>
    </Card>
  );
}
