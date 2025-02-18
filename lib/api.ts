// lib/api.ts
import { supabase } from './supabaseClient';
import { marked } from 'marked';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { BlogPost } from '../src/types/blog';

// Configure marked with a custom renderer for code blocks
const renderer = {
  code(code: string, language: string) {
    return SyntaxHighlighter({
      language,
      children: code,
      style: dracula,
      PreTag: 'div'
    });
  }
};

marked.use({ renderer });

export async function fetchPosts(): Promise<BlogPost[]> {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return [];
  }

  try {
    console.log("Attempting to fetch posts from Supabase...");
    
    // First, let's check if we can access the table
    const { data: tableInfo, error: tableError } = await supabase
      .from('blog_posts')
      .select('count');

    if (tableError) {
      console.error("Error checking blog_posts table:", tableError);
      return [];
    }

    console.log("Successfully connected to blog_posts table");

    // Now fetch the actual posts
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch blog posts.");
    }

    console.log("Successfully fetched posts:", data?.length || 0, "posts found");
    return data || [];
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return null;
  }

  try {
    console.log("Attempting to fetch post with slug:", slug);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }

    console.log("Successfully fetched post:", data?.title || 'No post found');
    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}
