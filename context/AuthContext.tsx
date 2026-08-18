'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    // 1. Check if URL contains hash tokens (#access_token=...) from implicit OAuth
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ data, error }) => {
            if (data?.session) {
              setSession(data.session);
              setUser(data.session.user);
              fetchProfile(data.session.user);
              // Clean URL and redirect to /dashboard
              window.history.replaceState(null, '', window.location.pathname);
              router.push('/dashboard');
            }
          })
          .catch((err) => {
            console.error('Error setting session from hash:', err);
          });
      }
    }

    // 2. Standard getSession check
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user);
        }
      } catch (err) {
        console.warn('Supabase auth getSession error:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 3. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user);
          if (event === 'SIGNED_IN') {
            router.push('/dashboard');
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setProfile(data);
      } else {
        // Fallback profile if profile row isn't synced yet
        const meta = currentUser.user_metadata;
        const fallback: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: meta?.full_name || meta?.name || currentUser.email?.split('@')[0] || 'User',
          avatar_url: meta?.avatar_url || meta?.picture || '',
          username: currentUser.email?.split('@')[0] || 'user',
        };
        setProfile(fallback);
      }
    } catch {
      const meta = currentUser.user_metadata;
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        full_name: meta?.full_name || meta?.name || currentUser.email?.split('@')[0] || 'User',
        avatar_url: meta?.avatar_url || meta?.picture || '',
        username: currentUser.email?.split('@')[0] || 'user',
      });
    }
  };

  const signInWithGoogle = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      console.error('Google Sign In error:', error.message);
      alert('Could not start Google auth. Check if Supabase URL & keys are configured in .env.local!');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn('Supabase signOut warning:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);

      if (typeof window !== 'undefined') {
        try {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('sb-') || key.includes('auth-token') || key.includes('supabase')) {
              localStorage.removeItem(key);
            }
          });
        } catch {
          // ignore
        }
      }
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
