import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || ''
);

async function fetchPosts() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('tags', 'Jerome');

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  console.log('Jerome\'s posts:', JSON.stringify(posts, null, 2));
}

fetchPosts();
