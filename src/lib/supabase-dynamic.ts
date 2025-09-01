import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

// Lazy load Supabase client
let supabaseClient: any = null;
let isInitializing = false;
let initPromise: Promise<any> | null = null;

const initializeSupabase = async () => {
  if (supabaseClient) return supabaseClient;
  if (isInitializing && initPromise) return initPromise;

  isInitializing = true;
  initPromise = (async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
      return null;
    }

    // Dynamic import of Supabase
    const { createClient } = await import('@supabase/supabase-js');
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });

    return supabaseClient;
  })();

  const client = await initPromise;
  isInitializing = false;
  return client;
};

// Google OAuth Sign In - Dynamic
export const signInWithGoogle = async () => {
  try {
    const supabase = await initializeSupabase();
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

// Get current session - Dynamic
export const getSession = async () => {
  try {
    const supabase = await initializeSupabase();
    if (!supabase) {
      return null;
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    return null;
  }
};

// Sign out - Dynamic
export const signOut = async () => {
  try {
    const supabase = await initializeSupabase();
    if (!supabase) {
      return { success: true };
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

// Listen to auth state changes - Dynamic
export const onAuthStateChange = async (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
  const supabase = await initializeSupabase();
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};

// Export a method to get supabase client if needed
export const getSupabaseClient = async () => initializeSupabase();