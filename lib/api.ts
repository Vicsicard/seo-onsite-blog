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

// Test function to verify connection and table structure
export async function testSupabaseConnection() {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return { success: false, error: "Client not initialized" };
  }

  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('blog_posts')
      .select('count');

    if (testError) {
      console.error("Error connecting to blog_posts table:", testError);
      return { 
        success: false, 
        error: testError.message,
        details: "Table might not exist or permissions are not set correctly"
      };
    }

    // Get table information
    const { data: tableInfo, error: schemaError } = await supabase
      .rpc('get_table_info', { table_name: 'blog_posts' });

    if (schemaError) {
      console.error("Error getting table schema:", schemaError);
      return { 
        success: true, 
        message: "Connected but couldn't fetch schema",
        error: schemaError.message 
      };
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      tableInfo
    };
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return { success: false, error: String(err) };
  }
}

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

// Function to create a test post
export async function createTestPost() {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return null;
  }

  const testPost = {
    title: "Test Kitchen Remodeling Article",
    slug: "test-kitchen-remodeling-article",
    content: "# Test Content\n\nThis is a test article about kitchen remodeling.",
    excerpt: "A test article about kitchen remodeling",
    seo_title: "Test Kitchen Remodeling | Denver Luxury Homes",
    seo_description: "Learn about luxury kitchen remodeling in Denver with our test article.",
    featured_image_url: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-kitchen-image-333333333.jpg",
    published_date: new Date().toISOString(),
    category: "kitchen",
    status: "published",
    tags: ["kitchen", "remodeling", "test"],
    meta_data: {
      reading_time: 5,
      views: 0,
      likes: 0
    }
  };

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([testPost])
      .select()
      .single();

    if (error) {
      console.error("Error creating test post:", error);
      return null;
    }

    console.log("Successfully created test post:", data);
    return data;
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}
