import { createClient } from '@supabase/supabase-js';

// Fallback values in case .env variables are not set (e.g. on Netlify without manual config)
const FALLBACK_URL = 'https://bhccyhgcbjbkbgmwtrde.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2N5aGdjYmpia2JnbXd0cmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTY2NDUsImV4cCI6MjA4NjI5MjY0NX0.wS-JAayOie4W2rvJb_sXV1zDkQ6HcQqYks2w4O9K1vE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
