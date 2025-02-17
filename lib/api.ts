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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch blog posts.");
    }
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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}
