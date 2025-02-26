'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import toast from 'react-hot-toast';

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setState((prev) => ({ ...prev, error, loading: false }));
        return;
      }

      setState({
        session,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error refreshing session:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as AuthError,
      }));
    }
  }, [supabase]);

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setState({
        session: null,
        loading: false,
        error: null,
      });

      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as AuthError,
      }));
    }
  };

  useEffect(() => {
    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        loading: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession, supabase]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
