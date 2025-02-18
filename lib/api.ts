// lib/api.ts
import { supabase } from './supabaseClient';
import { marked } from 'marked';
import type { BlogPost } from '../src/types/blog';

const POSTS_PER_PAGE = 9;
const ALLOWED_TAGS = ['homeremodeling', 'kitchenremodeling', 'bathroomremodeling', 'jerome'] as const;
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

// Configure marked with better styling options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true
});

// Convert Markdown to HTML with proper styling
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  try {
    return marked(markdown);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return markdown;
  }
}

// Parse tags string into array
export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return [];
  try {
    // First try parsing as JSON
    const parsed = JSON.parse(tagsString);
    return Array.isArray(parsed) ? parsed : [tagsString];
  } catch {
    // If not JSON, split by comma
    return tagsString.split(',').map(tag => tag.trim());
  }
}

export async function fetchPostsByTag(options: FetchPostsOptions): Promise<PaginatedPosts> {
  console.log(`[fetchPostsByTag] Fetching posts with tag: ${options.tag}`);
  
  const defaultResponse = {
    posts: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  };

  try {
    const {
      tag,
      page = 1,
      limit = POSTS_PER_PAGE
    } = options;

    if (!ALLOWED_TAGS.includes(tag as AllowedTag)) {
      console.error(`[fetchPostsByTag] Invalid tag: ${tag}`);
      return defaultResponse;
    }

    console.log(`[fetchPostsByTag] Querying Supabase with params:`, { tag, page, limit });
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .ilike('tags', `%${tag}%`)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error("[fetchPostsByTag] Supabase error:", error);
      throw error;
    }

    if (!data) {
      console.log("[fetchPostsByTag] No data returned from Supabase");
      return defaultResponse;
    }

    console.log(`[fetchPostsByTag] Successfully fetched ${data.length} posts`);

    // Process content for each post
    const posts = data.map(post => {
      try {
        return {
          ...post,
          content: convertMarkdownToHtml(post.content)
        };
      } catch (err) {
        console.error(`[fetchPostsByTag] Error processing post ${post.id}:`, err);
        return post;
      }
    });

    const total = count || posts.length;
    const totalPages = Math.ceil(total / limit);

    console.log(`[fetchPostsByTag] Processed ${posts.length} posts, total pages: ${totalPages}`);

    return {
      posts,
      total,
      totalPages,
      currentPage: page
    };
  } catch (err) {
    console.error("[fetchPostsByTag] Unexpected error:", err);
    return defaultResponse;
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[fetchPostBySlug] Fetching post with slug: ${slug}`);

  if (!slug) {
    console.error("[fetchPostBySlug] No slug provided");
    return null;
  }

  try {
    console.log(`[fetchPostBySlug] Querying Supabase for slug: ${slug}`);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("[fetchPostBySlug] Supabase error:", error);
      throw error;
    }

    if (!data) {
      console.log(`[fetchPostBySlug] No post found with slug: ${slug}`);
      return null;
    }

    console.log(`[fetchPostBySlug] Successfully fetched post: ${data.title}`);

    try {
      const processedPost = {
        ...data,
        content: convertMarkdownToHtml(data.content)
      };
      console.log(`[fetchPostBySlug] Successfully processed post content`);
      return processedPost;
    } catch (err) {
      console.error("[fetchPostBySlug] Error processing post content:", err);
      return data;
    }
  } catch (err) {
    console.error("[fetchPostBySlug] Unexpected error:", err);
    return null;
  }
}

export async function fetchAllPosts(): Promise<{
  homePosts: BlogPost[];
  kitchenPosts: BlogPost[];
  bathroomPosts: BlogPost[];
  jeromePosts: BlogPost[];
}> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const posts = (data || []).map(post => ({
      ...post,
      content: convertMarkdownToHtml(post.content)
    }));

    return {
      homePosts: posts.filter(post => parseTags(post.tags).includes('homeremodeling')),
      kitchenPosts: posts.filter(post => parseTags(post.tags).includes('kitchenremodeling')),
      bathroomPosts: posts.filter(post => parseTags(post.tags).includes('bathroomremodeling')),
      jeromePosts: posts.filter(post => parseTags(post.tags).includes('jerome'))
    };
  } catch (err) {
    console.error("Error fetching all posts:", err);
    return {
      homePosts: [],
      kitchenPosts: [],
      bathroomPosts: [],
      jeromePosts: []
    };
  }
}

// Helper function to get tag for category
export function getCategoryTag(category: string): AllowedTag | null {
  const categoryTags: Record<string, AllowedTag> = {
    'home-remodeling': 'homeremodeling',
    'kitchen-remodeling': 'kitchenremodeling',
    'bathroom-remodeling': 'bathroomremodeling'
  };
  
  return categoryTags[category] || null;
}
