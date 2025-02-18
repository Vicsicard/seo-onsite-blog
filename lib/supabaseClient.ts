// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duofozyjmsicofmnmsal.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b2ZvenlqbXNpY29mbW5tc2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MzQ2NTcsImV4cCI6MjA1MzMxMDY1N30.c_By4uNid3afZBtysYPiyEHcEGih-naisbqmzOnf1dQ';

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_BLOG_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
