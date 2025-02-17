// lib/api.js
import { supabase } from './supabaseClient';
import { marked } from 'marked';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Configure marked with a custom renderer for code blocks
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  return `<pre style="background-color:#2d2d2d;padding:1em;">${SyntaxHighlighter.render({
    language,
    value: code,
    style: dracula,
    PreTag: 'div'
  })}</pre>`;
};

marked.setOptions({
  renderer,
  pedantic: false,
  gfm: true,
  breaks: true,
});

export async function fetchPosts() {
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
    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return [];
  }
}

export async function fetchPostBySlug(slug) {
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
