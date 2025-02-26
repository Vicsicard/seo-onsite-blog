require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  try {
    console.log('Fetching database structure...');
    
    // Get column information from blog_posts table
    const { data: columns, error } = await supabase
      .rpc('get_column_info', { table_name: 'blog_posts' });

    if (error) {
      console.error('Error fetching columns:', error);
      
      // If RPC fails, try a direct query
      console.log('Trying alternative method...');
      
      // Fetch a single post to see columns
      const { data: samplePost, error: sampleError } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        console.error('Error fetching sample post:', sampleError);
      } else {
        console.log('Sample post structure:');
        console.log(Object.keys(samplePost[0]));
      }
      
      return;
    }
    
    console.log('Columns in blog_posts table:');
    console.table(columns);
    
  } catch (error) {
    console.error('Error checking database structure:', error);
  }
}

checkDatabaseStructure();
