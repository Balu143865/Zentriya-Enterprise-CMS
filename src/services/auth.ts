import { UserProfile, UserRole } from '../types';
import { getSupabase, db } from './db';

const MOCK_USERS: UserProfile[] = [
  { id: 'usr_super', email: 'superadmin@zentriya.com', name: 'Dr. Anand Kumar', role: 'Super Admin', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80' },
  { id: 'usr_admin', email: 'admin@zentriya.com', name: 'Meera Deshmukh', role: 'Admin', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80' },
  { id: 'usr_hr', email: 'hr@zentriya.com', name: 'Rahul Sen', role: 'HR', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80' },
  { id: 'usr_trainer', email: 'trainer@zentriya.com', name: 'Prof. Sridhar Raju', role: 'Trainer', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80' },
  { id: 'usr_editor', email: 'editor@zentriya.com', name: 'Sneha Rao', role: 'Editor', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80' },
  { id: 'usr_support', email: 'support@zentriya.com', name: 'Karthik Gowda', role: 'Support', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80' }
];

export const auth = {
  getMockUsers(): UserProfile[] {
    return MOCK_USERS;
  },

  async login(email: string, password?: string): Promise<UserProfile> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123',
        });
        if (!error && data.user) {
          // Check role from metadata or profile table in Supabase
          const role = (data.user.user_metadata?.role as UserRole) || 'Admin';
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role,
          };
          localStorage.setItem('zentriya_active_user', JSON.stringify(profile));
          db.logActivity('Admin Authentication Success', `Logged in via Supabase Auth with role: ${role}`);
          return profile;
        }
      } catch (e) {
        console.error('Supabase auth failed, falling back to mock authentication', e);
      }
    }

    // Mock Login matching pre-seeded users
    const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      localStorage.setItem('zentriya_active_user', JSON.stringify(matchedUser));
      db.logActivity('Admin Authentication Success', `Logged in via fallback with role: ${matchedUser.role}`);
      return matchedUser;
    }

    // Default create dynamic profile for testing other emails
    const defaultProfile: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      name: email.split('@')[0].toUpperCase(),
      role: 'Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'
    };
    localStorage.setItem('zentriya_active_user', JSON.stringify(defaultProfile));
    db.logActivity('Admin Guest Authentication Success', `Dynamic guest account initialized as Admin.`);
    return defaultProfile;
  },

  logout() {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.signOut();
    }
    const current = this.getCurrentUser();
    if (current) {
      db.logActivity('Session Terminated', `Logged out account: ${current.email}`);
    }
    localStorage.removeItem('zentriya_active_user');
  },

  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem('zentriya_active_user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  // Helper function to check RBAC permissions
  hasAccess(role: UserRole, module: string): boolean {
    if (role === 'Super Admin') return true;

    switch (module) {
      case 'dashboard':
        return true; // All authenticated roles can see overview dashboard
      case 'settings':
      case 'home':
      case 'about':
      case 'why_choose_us':
      case 'partners':
      case 'faqs':
        return role === 'Admin';
      case 'services':
      case 'internships':
      case 'courses':
        return role === 'Admin' || role === 'Trainer';
      case 'gallery':
      case 'blogs':
        return role === 'Admin' || role === 'Editor';
      case 'careers':
      case 'applications':
        return role === 'Admin' || role === 'HR';
      case 'contacts':
        return role === 'Admin' || role === 'Support';
      default:
        return false;
    }
  }
};
