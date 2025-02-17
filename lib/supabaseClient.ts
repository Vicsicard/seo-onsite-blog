// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be defined in environment variables.");
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}

export { supabase };
