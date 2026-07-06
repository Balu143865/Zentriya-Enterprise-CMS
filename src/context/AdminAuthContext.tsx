import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getSupabase } from '../services/db';
import { auth } from '../services/auth';

interface AdminAuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (name: string, avatarUrl?: string) => Promise<UserProfile>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => auth.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initSession() {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch from public.admins table to populate user state
          const { data: dbAdmin, error: dbErr } = await supabase
            .from('admins')
            .select('role, email')
            .eq('user_id', session.user.id)
            .single();

          if (!dbErr && dbAdmin && dbAdmin.role === 'owner') {
            const profile: UserProfile = {
              id: session.user.id,
              email: session.user.email || dbAdmin.email,
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || dbAdmin.email.split('@')[0].toUpperCase(),
              role: 'OWNER',
              avatarUrl: '/logo.png',
            };
            setUser(profile);
            localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
          } else {
            // Not a valid admin or not owner, clear local state
            setUser(null);
            localStorage.removeItem('zentriya_active_user');
          }
        } else {
          setUser(null);
          localStorage.removeItem('zentriya_active_user');
        }
      } catch (err) {
        console.error('Error initializing admin session:', err);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    // Set up auth state listener
    const supabase = getSupabase();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('zentriya_active_user');
        } else if (session?.user) {
          try {
            const { data: dbAdmin, error: dbErr } = await supabase
              .from('admins')
              .select('role, email')
              .eq('user_id', session.user.id)
              .single();

            if (!dbErr && dbAdmin && dbAdmin.role === 'owner') {
              const profile: UserProfile = {
                id: session.user.id,
                email: session.user.email || dbAdmin.email,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || dbAdmin.email.split('@')[0].toUpperCase(),
                role: 'OWNER',
                avatarUrl: '/logo.png',
              };
              setUser(profile);
              localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
            }
          } catch (e) {
            console.error('Auth state change query error:', e);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const profile = await auth.login(email, password);
      setUser(profile);
      return profile;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (name: string, avatarUrl?: string) => {
    const updated = await auth.updateProfile(name, avatarUrl);
    setUser(updated);
    return updated;
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
