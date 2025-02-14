'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/auth/login?message=Password updated successfully');
    }
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid w-full items-center gap-4'>
              {error && (
                <div className='text-sm text-red-500 font-medium'>{error}</div>
              )}
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>New Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  minLength={6}
                />
              </div>
              <Button type='submit'>Update Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
