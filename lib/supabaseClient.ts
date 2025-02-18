// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('[Supabase] Missing Supabase URL');
  throw new Error('Missing Supabase URL. Please check your environment variables.');
}

if (!supabaseAnonKey) {
  console.error('[Supabase] Missing Supabase Anon Key');
  throw new Error('Missing Supabase Anon Key. Please check your environment variables.');
}

console.log('[Supabase] Initializing client...');
console.log('[Supabase] Using URL:', supabaseUrl);

// Create Supabase client with error handling
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
});

// Test the connection
const testConnection = async () => {
  console.log('[Supabase] Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (error) {
      console.error('[Supabase] Connection test failed:', error);
      throw error;
    }

    console.log('[Supabase] Connection successful');
    return true;
  } catch (err) {
    console.error('[Supabase] Error testing connection:', err);
    return false;
  }
};

// Execute connection test
testConnection()
  .then(success => {
    if (!success) {
      console.error('[Supabase] Failed to establish initial connection');
    }
  })
  .catch(err => {
    console.error('[Supabase] Unexpected error during connection test:', err);
  });

export { supabase, testConnection };
