import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '@/types/blog';

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchPostsByTag({ tag, page = 1, limit = 9 }: { tag: string; page?: number; limit?: number }) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('tags', `%${tag}%`)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], error };
  }

  return { posts: posts as BlogPost[], error: null };
}

export async function fetchPostBySlug(slug: string) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .limit(1);

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return posts?.[0] as BlogPost || null;
}

export async function fetchAllPosts({ page = 1, limit = 9 }: { page?: number; limit?: number }) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], error };
  }

  return { posts: posts as BlogPost[], error: null };
}
