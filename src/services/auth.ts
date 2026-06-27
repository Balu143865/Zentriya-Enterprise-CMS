import { UserProfile, UserRole } from '../types';
import { getSupabase, db } from './db';

// Default Owner fallback credentials if Supabase is not connected yet
const DEFAULT_OWNER_EMAIL = 'owner@zentriya.com';
const DEFAULT_OWNER_PASSWORD = 'password123';

export const auth = {
  // Helper to retrieve the default owner credentials or custom configured ones from local storage
  getOwnerCredentials() {
    const customEmail = localStorage.getItem('zentriya_owner_email') || DEFAULT_OWNER_EMAIL;
    const customPassword = localStorage.getItem('zentriya_owner_password') || DEFAULT_OWNER_PASSWORD;
    return { email: customEmail, password: customPassword };
  },

  // Save updated Owner credentials locally (only available in mock/local mode)
  setOwnerCredentials(email: string, password?: string) {
    localStorage.setItem('zentriya_owner_email', email.toLowerCase());
    if (password) {
      localStorage.setItem('zentriya_owner_password', password);
    }
  },

  async login(email: string, password?: string): Promise<UserProfile> {
    const supabase = getSupabase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || DEFAULT_OWNER_PASSWORD;

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) throw error;

        if (data.user) {
          // 1. Double verification: check JWT user_metadata for role OR query the `users` table
          let role: UserRole = (data.user.user_metadata?.role as UserRole) || 'OWNER';
          
          // Attempt to check database for role validation
          try {
            const { data: dbUser, error: dbErr } = await supabase
              .from('users')
              .select('role, full_name, avatar, is_active')
              .eq('id', data.user.id)
              .single();

            if (!dbErr && dbUser) {
              if (!dbUser.is_active) {
                await supabase.auth.signOut();
                throw new Error('This account is currently deactivated.');
              }
              role = dbUser.role as UserRole;
            }
          } catch (dbEx) {
            console.warn('Could not read users table role, relying on jwt metadata:', dbEx);
          }

          // Strict Security: Only OWNER can log in to admin console
          if (role !== 'OWNER') {
            await supabase.auth.signOut();
            throw new Error('Access Denied: Only the company OWNER possesses administrative console clearance.');
          }

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0].toUpperCase(),
            role: 'OWNER',
            avatarUrl: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
          };

          localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
          db.logActivity('Owner Authentication Success', `Successfully logged in via Supabase secure portal.`);
          return profile;
        }
      } catch (e: any) {
        console.error('Supabase secure auth failed:', e.message || e);
        // If Supabase failed because user was not found or connection is offline, we fall back to mock
        if (e.message && (e.message.includes('Invalid login credentials') || e.message.includes('Access Denied') || e.message.includes('deactivated'))) {
          throw e; // Reraise explicit credentials or role validation failures
        }
      }
    }

    // Fallback Mock authentication for OWNER-only system
    const credentials = this.getOwnerCredentials();
    if (cleanEmail === credentials.email.toLowerCase() && cleanPassword === credentials.password) {
      const storedProfile = localStorage.getItem('zentriya_owner_profile');
      let profile: UserProfile = {
        id: 'usr_owner_default',
        email: cleanEmail,
        name: 'Company Owner',
        role: 'OWNER',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
      };

      if (storedProfile) {
        try {
          profile = { ...profile, ...JSON.parse(storedProfile) };
        } catch (e) {}
      }

      localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
      db.logActivity('Owner Authentication Success', `Successfully logged in via fallback secure credentials.`);
      return profile;
    }

    throw new Error('Invalid security credentials. Access denied.');
  },

  async logout() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    const current = this.getCurrentUser();
    if (current) {
      db.logActivity('Session Terminated', `Securely logged out owner account: ${current.email}`);
    }
    localStorage.removeItem('zentriya_active_user');
  },

  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem('zentriya_active_user');
    if (!data) return null;
    try {
      const profile = JSON.parse(data);
      // Enforce: role MUST be OWNER
      if (profile.role !== 'OWNER') {
        localStorage.removeItem('zentriya_active_user');
        return null;
      }
      return profile;
    } catch (e) {
      return null;
    }
  },

  // Update profile attributes (full_name / avatarUrl)
  async updateProfile(name: string, avatarUrl?: string): Promise<UserProfile> {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const updated: UserProfile = {
      ...current,
      name,
      avatarUrl: avatarUrl || current.avatarUrl,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        // Update auth metadata
        const { error: authErr } = await supabase.auth.updateUser({
          data: { name, full_name: name, avatar_url: avatarUrl }
        });
        if (authErr) throw authErr;

        // Update public.users table if it exists
        await supabase.from('users').update({
          full_name: name,
          avatar: avatarUrl
        }).eq('id', current.id);

      } catch (e) {
        console.warn('Could not fully sync profile to Supabase database, updating locally:', e);
      }
    }

    // Always update local session states
    localStorage.setItem('zentriya_active_user', JSON.stringify(updated));
    localStorage.setItem('zentriya_owner_profile', JSON.stringify(updated));
    db.logActivity('Owner Profile Updated', `Owner changed profile name to: ${name}`);
    return updated;
  },

  // Forgot password request
  async forgotPassword(email: string): Promise<string> {
    const supabase = getSupabase();
    const cleanEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/admin/login?reset=true`,
        });
        if (error) throw error;
        return 'Password reset link has been dispatched to your email address.';
      } catch (e: any) {
        console.error('Supabase forgotPassword failed:', e);
      }
    }

    // Mock reset logic for demo mode
    const credentials = this.getOwnerCredentials();
    if (cleanEmail === credentials.email.toLowerCase()) {
      return `[DEMO MODE] Security code generated for reset: ${Math.floor(100000 + Math.random() * 900000)}. Use password "password123" to sign in or update password in dashboard settings.`;
    }
    throw new Error('Email address not registered as the system OWNER.');
  },

  // Change password request
  async changePassword(password: string): Promise<void> {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      } catch (e: any) {
        console.error('Supabase change password failed:', e);
        throw e;
      }
    }

    // Local state change fallback
    this.setOwnerCredentials(current.email, password);
    db.logActivity('Security Credentials Modified', `Owner successfully updated their security password.`);
  },

  // RBAC Permission Gate - only 'OWNER' has any access
  hasAccess(role: UserRole, _module: string): boolean {
    return role === 'OWNER';
  }
};
