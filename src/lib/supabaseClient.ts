import { createClient, Session } from '@supabase/supabase-js';

// Fallback values in case .env variables are not set (e.g. on Netlify without manual config)
const FALLBACK_URL = 'https://bhccyhgcbjbkbgmwtrde.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2N5aGdjYmpia2JnbXd0cmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTY2NDUsImV4cCI6MjA4NjI5MjY0NX0.wS-JAayOie4W2rvJb_sXV1zDkQ6HcQqYks2w4O9K1vE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Configure Supabase client with proper auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
});

// Helper to get current session
export const getSupabaseSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// Helper to check if user is authenticated with the admin email
export const isAuthenticatedAdmin = async (): Promise<boolean> => {
    const session = await getSupabaseSession();
    if (!session) return false;

    const userEmail = session.user?.email;
    // This should match the email in your RLS policy
    return userEmail === 'abdorhamnk134@gmail.com';
};

// Helper to restore session from stored tokens (useful for page reloads)
export const restoreSession = async (): Promise<Session | null> => {
    // First check if we already have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;

    // Try to restore from localStorage tokens
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
        try {
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });
            if (error) {
                console.warn('Failed to restore session:', error);
                return null;
            }
            return data.session;
        } catch (err) {
            console.warn('Error restoring session:', err);
            return null;
        }
    }

    return null;
};
