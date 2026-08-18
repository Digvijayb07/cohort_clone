'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

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

  const supabase = createClient();

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google Sign In error:', error.message);
      alert('Could not start Google auth. Check if Supabase URL & keys are configured in .env.local!');
    }
  };

  const signOut = async () => {
    try {
      // Use local scope to clear session reliably without failing on network/token mismatch
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn('Supabase signOut warning:', err);
    } finally {
      // Always reset application state
      setUser(null);
      setProfile(null);
      setSession(null);

      // Clean up any lingering Supabase auth keys from localStorage
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
