import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, UserRole } from '../types/database';
import { dataService } from '../services/dataService';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    company_name?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signUp: (
    email: string, 
    password: string, 
    fullName: string, 
    companyName?: string, 
    phone?: string
  ) => Promise<{ success: boolean; error?: string; sessionEstablished?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  refreshProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const configured = isSupabaseConfigured();

  const loadUserProfile = useCallback(async (userId: string, email?: string): Promise<Profile | null> => {
    try {
      // 1. Try direct fetch by ID from database
      const p = await dataService.getProfileById(userId);
      if (p) return p;

      // 2. Fallback check all profiles
      const profiles = await dataService.getProfiles();
      const found = profiles.find((item) => item.id === userId || (email && item.email.toLowerCase() === email.toLowerCase()));
      return found || null;
    } catch (err) {
      console.error('Error loading user profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    if (!user) return null;
    const p = await loadUserProfile(user.id, user.email);
    if (p) setProfile(p);
    return p;
  }, [user, loadUserProfile]);

  // Initialize auth state strictly from Supabase session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (configured) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase getSession error:', error.message);
          }
          if (session?.user && mounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: session.user.user_metadata
            };
            setUser(authUser);
            const userProfile = await loadUserProfile(authUser.id, authUser.email);
            if (mounted) setProfile(userProfile);
          } else if (mounted) {
            setUser(null);
            setProfile(null);
          }
        } catch (err) {
          console.warn('Supabase session init error:', err);
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } else {
        // When not configured, user starts strictly logged out
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    // Supabase Auth real-time listener
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (configured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          };
          setUser(authUser);
          const p = await loadUserProfile(authUser.id, authUser.email);
          if (mounted) setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [configured, loadUserProfile]);

  // Real Email/Password Authentication
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setLoading(true);
    try {
      if (!configured) {
        setLoading(false);
        return { 
          success: false, 
          error: 'Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings to enable authentication.' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        setLoading(false);
        return { success: false, error: 'Authentication failed. User record not returned.' };
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: data.user.user_metadata
      };
      setUser(authUser);

      const userProfile = await loadUserProfile(authUser.id, authUser.email);
      setProfile(userProfile);
      setLoading(false);

      return { 
        success: true, 
        role: userProfile?.role || 'customer' 
      };
    } catch (err: unknown) {
      setLoading(false);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred during sign in.' 
      };
    }
  };

  // Real Account Registration
  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    companyName?: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string; sessionEstablished?: boolean }> => {
    setLoading(true);
    try {
      if (!configured) {
        setLoading(false);
        return { 
          success: false, 
          error: 'Supabase authentication service is not connected.' 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { 
            full_name: fullName.trim(), 
            company_name: companyName?.trim() || null, 
            phone: phone?.trim() || null 
          }
        }
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email.trim().toLowerCase(),
          user_metadata: { 
            full_name: fullName.trim(),
            company_name: companyName?.trim() || undefined,
            phone: phone?.trim() || undefined
          }
        };

        const sessionEstablished = Boolean(data.session);

        if (sessionEstablished) {
          setUser(authUser);
          // 1. Direct profile upsert to guarantee persistence even if the trigger hasn't fired
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email || email.trim().toLowerCase(),
              full_name: fullName.trim(),
              company_name: companyName?.trim() || null,
              phone: phone?.trim() || null,
              role: 'customer',
              active: true
            }, { onConflict: 'id' });
          } catch (profErr) {
            console.warn('Direct profile upsert error:', profErr);
          }

          const p = await loadUserProfile(data.user.id, data.user.email);
          setProfile(p || {
            id: data.user.id,
            email: data.user.email || email.trim().toLowerCase(),
            full_name: fullName.trim(),
            company_name: companyName?.trim() || null,
            phone: phone?.trim() || null,
            role: 'customer',
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }

        setLoading(false);
        return { success: true, sessionEstablished };
      }

      setLoading(false);
      return { success: true, sessionEstablished: false };
    } catch (err: unknown) {
      setLoading(false);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Registration failed' 
      };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase sign out error:', err);
      }
    }
    setUser(null);
    setProfile(null);
  };

  // Reset Password
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (configured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Reset failed' };
      }
    }
    return { success: false, error: 'Supabase authentication not configured.' };
  };

  // Update Password (from reset flow or authenticated session)
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (configured) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Password update failed' };
      }
    }
    return { success: false, error: 'Supabase authentication not configured.' };
  };

  // Update Profile
  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user || !profile) return false;
    try {
      // Prevent client-side role manipulation
      const safeData = { ...data, id: profile.id };
      delete safeData.role; // Role updates cannot be performed by regular profile updates

      const updated = await dataService.updateProfile(safeData);
      setProfile(updated);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  };

  // Computed RBAC permissions based strictly on database profile
  const role: UserRole = profile?.role || 'customer';
  const isActive = profile ? profile.active : false;
  const isAdmin = Boolean(user && profile && profile.role === 'admin' && isActive);
  const isManager = Boolean(user && profile && (profile.role === 'manager' || profile.role === 'project_manager') && isActive);
  const isStaff = Boolean(user && profile && (isAdmin || isManager) && isActive);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isManager,
        isStaff,
        loading,
        isConfigured: configured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
