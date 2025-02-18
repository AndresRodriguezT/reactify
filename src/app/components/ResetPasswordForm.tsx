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
import { createClient } from '../utils/supabase/client';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            {error && (
              <div className='text-sm text-red-500 font-medium'>{error}</div>
            )}
            {success && (
              <div className='text-sm text-green-500 font-medium'>
                Check your email for a password reset link
              </div>
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
            <Button type='submit'>Send Reset Link</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Link href='/auth/login'>
          <Button variant='ghost'>Back to Login</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
