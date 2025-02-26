'use client';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from './Loading';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export default function LandingInput() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const router = useRouter();
  const auth = useAuth();
  const session = auth?.session;

  const searchTracks = async (searchQuery: string) => {
    try {
      const response = await fetch(
        //Fetch a mi worker
        `https://soundlens-worker.soundlens.workers.dev/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.tracks || !data.tracks.items) {
        throw new Error('Invalid response data');
      }

      return data.tracks.items;
    } catch (error) {
      console.error('Error in searchTracks:', error);
      throw new Error(
        `Error searching tracks: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setTracks([]);

      if (!session) {
        toast('Please, log in to continue');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/auth/login');
        return;
      }

      const results = await searchTracks(query);
      setTracks(results);
    } catch (error) {
      toast.error('Error searching tracks');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <main className='fixed inset-0 bg-[#1E1F20] text-gray-100 overflow-auto'>
      {isLoading && <LoadingSpinner />}
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-3xl mx-auto animate-fade-in'>
          <div className='flex flex-col items-center space-y-6'>
            {/* Título superior */}
            <div className='text-center space-y-2'>
              <h1 className='text-3xl font-semibold text-green-500 animate-slide-down'>
                Welcome to reactify!
              </h1>
            </div>

            {/* Input de búsqueda */}
            <div className='w-full relative animate-slide-up'>
              <Textarea
                placeholder='Search your song...'
                className='h-24 w-full !bg-slate-500/70 border-0 focus-visible:ring-1 
                         focus-visible:ring-green-500 text-gray-100 placeholder:text-gray-400 
                         resize-none pr-12 transition-all duration-200'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                size='icon'
                className='absolute bottom-3 right-3 h-8 w-8 bg-transparent 
                         bg-green-600 hover:bg-green-700 text-gray-200 
                         transition-all duration-200 hover:scale-105 active:scale-95'
                onClick={handleSearch}
                disabled={isLoading}
              >
                <ArrowUp className='h-5 w-5' />
              </Button>
            </div>

            {/* Resultados */}
            {tracks.length > 0 && (
              <div className='w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className='bg-[#485569] p-4 rounded-lg hover:bg-opacity-80 
                             transition-all duration-200 cursor-pointer'
                  >
                    {track.album.images[0] && (
                      <Image
                        src={track.album.images[0].url}
                        alt={track.name}
                        width={300}
                        height={300}
                        className='w-full aspect-square object-cover rounded-md mb-3'
                      />
                    )}
                    <h3 className='font-semibold truncate'>{track.name}</h3>
                    <p className='text-sm text-gray-300 truncate'>
                      {track.artists
                        .map((a: { name: string }) => a.name)
                        .join(', ')}
                    </p>
                    <p className='text-xs text-gray-400 mt-1 truncate'>
                      {track.album.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
