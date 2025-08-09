import { createClient } from '@supabase/supabase-js';

// Supabase를 사용하지 않으므로 placeholder 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Supabase client를 조건부로 생성 (환경변수가 없으면 null)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') 
  ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
}) : null as any;

// Google OAuth Sign In
export const signInWithGoogle = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    // Google sign in error
    return { success: false, error: error.message };
  }
};

// Get current session
export const getSession = async () => {
  try {
    if (!supabase) {
      return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    // Get session error
    return null;
  }
};

// Sign out
export const signOut = async () => {
  try {
    if (!supabase) {
      return { success: true };
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    // Sign out error
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};