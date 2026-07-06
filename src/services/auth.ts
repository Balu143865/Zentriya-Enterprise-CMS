import { UserProfile, UserRole } from '../types';
import { getSupabase, db } from './db';

export const auth = {
  // Real login using Supabase Auth (with automatic local simulation fallback)
  async login(email: string, password?: string): Promise<UserProfile> {
    const supabase = getSupabase();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!supabase) {
      console.warn('Supabase client not initialized or offline. Falling back to local/mock session.');
      const profile: UserProfile = {
        id: 'mock_owner_id_99',
        email: cleanEmail || 'info.zentriya@gmail.com',
        name: (cleanEmail.split('@')[0] || 'OWNER').toUpperCase() + ' (SIMULATED)',
        role: 'OWNER',
        avatarUrl: '/logo.png',
      };
      localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
      db.logActivity('Owner Authentication Success (Simulated)', `Successfully logged in via local fallback portal: ${cleanEmail}`);
      return profile;
    }

    const cleanPassword = password || '';

    // 1. Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error('Authentication failed: No user data returned.');
    }

    // 2. Query public.admins table to verify owner status
    const { data: dbAdmin, error: dbErr } = await supabase
      .from('admins')
      .select('role, email')
      .eq('user_id', data.user.id)
      .single();

    if (dbErr || !dbAdmin) {
      await supabase.auth.signOut();
      throw new Error('Access Denied: Your account is not registered in the administrator database.');
    }

    // 3. Strict security rule: Only allow role='owner'
    if (dbAdmin.role !== 'owner') {
      await supabase.auth.signOut();
      throw new Error('Access Denied: Only company OWNER roles possess administrative access.');
    }

    // 4. Set the authenticated OWNER profile
    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email || cleanEmail,
      name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0].toUpperCase(),
      role: 'OWNER',
      avatarUrl: '/logo.png',
    };

    localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
    db.logActivity('Owner Authentication Success', `Successfully logged in via Supabase secure portal: ${cleanEmail}`);
    return profile;
  },

  // Real sign-out using Supabase Auth
  async logout(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out of Supabase:', e);
      }
    }
    localStorage.removeItem('zentriya_active_user');
  },

  // Get current session profile from local storage
  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem('zentriya_active_user');
    if (!data) return null;
    try {
      const profile = JSON.parse(data);
      if (profile.role !== 'OWNER') {
        localStorage.removeItem('zentriya_active_user');
        return null;
      }
      return profile;
    } catch (e) {
      return null;
    }
  },

  // Update user profile in auth metadata
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
      const { error: authErr } = await supabase.auth.updateUser({
        data: { name, full_name: name, avatar_url: avatarUrl }
      });
      if (authErr) throw authErr;
    }

    localStorage.setItem('zentriya_active_user', JSON.stringify(updated));
    db.logActivity('Owner Profile Updated', `Owner changed profile name to: ${name}`);
    return updated;
  },

  // Real password recovery using Supabase Auth
  async forgotPassword(email: string): Promise<string> {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase client not initialized or offline. Simulating forgotPassword success.');
      return 'Password reset link has been dispatched to your email address (Simulated fallback active).';
    }

    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/admin/login?reset=true`,
    });

    if (error) throw error;
    return 'Password reset link has been dispatched to your email address.';
  },

  // Real password update using Supabase Auth
  async changePassword(password: string): Promise<void> {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase client not initialized or offline. Simulating changePassword success.');
      db.logActivity('Security Credentials Modified (Simulated)', 'Owner successfully simulated updating their security password.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    db.logActivity('Security Credentials Modified', 'Owner successfully updated their security password.');
  },

  // RBAC Permission Gate - only 'OWNER' has access
  hasAccess(role: UserRole, _module: string): boolean {
    return role === 'OWNER';
  }
};
