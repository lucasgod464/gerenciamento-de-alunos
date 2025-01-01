import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://azimkjlilrqdlrokvwqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aW1ramxpbHJxZGxyb2t2d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTY2MzYsImV4cCI6MjA1MTMzMjYzNn0.sGrGX6v4rwmhT0Fav1rECZvRNnga6qwdtS4yAGkMfoU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});