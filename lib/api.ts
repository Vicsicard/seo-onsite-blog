// lib/api.ts
import { supabase } from './supabaseClient';
import { marked } from 'marked';
import type { BlogPost } from '../src/types/blog';

const POSTS_PER_PAGE = 9;
const ALLOWED_TAGS = ['homeremodeling', 'kitchenremodeling', 'bathroomremodeling'] as const;
type AllowedTag = typeof ALLOWED_TAGS[number];

interface FetchPostsOptions {
  tag: AllowedTag;
  page?: number;
  limit?: number;
}

interface PaginatedPosts {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Validate if a tag is allowed
function isAllowedTag(tag: string): tag is AllowedTag {
  return ALLOWED_TAGS.includes(tag as AllowedTag);
}

// Convert Markdown to HTML with proper styling
export function convertMarkdownToHtml(markdown: string): string {
  const html = marked(markdown, {
    gfm: true,
    breaks: true,
    sanitize: false
  });
  return html;
}

export async function fetchPostsByTag(options: FetchPostsOptions): Promise<PaginatedPosts> {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    };
  }

  // Validate tag
  if (!isAllowedTag(options.tag)) {
    console.error(`Invalid tag: ${options.tag}. Must be one of: ${ALLOWED_TAGS.join(', ')}`);
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    };
  }

  try {
    const {
      tag,
      page = 1,
      limit = POSTS_PER_PAGE
    } = options;

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Build query with strict tag matching
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .contains('tags', [tag]) // Exact tag match
      .order('published_date', { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    // Additional validation to ensure posts have exactly the tag we want
    const filteredPosts = data.filter(post => 
      Array.isArray(post.tags) && 
      post.tags.some(t => t === tag)
    );

    // Process markdown content for each post
    const processedPosts = filteredPosts.map(post => ({
      ...post,
      content: convertMarkdownToHtml(post.content)
    }));

    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      posts: processedPosts,
      total,
      totalPages,
      currentPage: page
    };
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    };
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
      .eq('status', 'published')
      .single();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Verify the post has at least one of our allowed tags
    const hasAllowedTag = Array.isArray(data.tags) && 
      data.tags.some(tag => ALLOWED_TAGS.includes(tag as AllowedTag));

    if (!hasAllowedTag) {
      console.error("Post does not have any allowed tags");
      return null;
    }

    // Convert markdown content to HTML
    return {
      ...data,
      content: convertMarkdownToHtml(data.content)
    };
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return null;
  }
}

// Helper function to get tag for category
export function getCategoryTag(category: string): AllowedTag | null {
  const categoryTags: Record<string, AllowedTag> = {
    'home-remodeling': 'homeremodeling',
    'kitchen-remodeling': 'kitchenremodeling',
    'bathroom-remodeling': 'bathroomremodeling'
  };
  
  const tag = categoryTags[category];
  return tag || null;
}
