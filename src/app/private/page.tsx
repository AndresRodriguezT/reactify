import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  const { user } = data;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Perfil Privado</h1>
      <div className='space-y-2'>
        <p>Email: {user.email}</p>
        <p>Provider: {user.app_metadata.provider}</p>
      </div>
    </div>
  );
}
