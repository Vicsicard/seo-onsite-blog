// lib/api.ts
import { supabase } from './supabaseClient';
import { marked } from 'marked';
import type { BlogPost } from '../src/types/blog';
import { parseTags } from '../src/types/blog';

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

// Validate if a tag is allowed
function isAllowedTag(tag: string): tag is AllowedTag {
  return ALLOWED_TAGS.includes(tag as AllowedTag);
}

// Convert Markdown to HTML with proper styling
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  try {
    const html = marked(markdown, {
      gfm: true,
      breaks: true,
      sanitize: false
    });
    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return markdown;
  }
}

export async function fetchPostsByTag(options: FetchPostsOptions): Promise<PaginatedPosts> {
  const defaultResponse = {
    posts: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  };

  // Validate tag
  if (!isAllowedTag(options.tag)) {
    console.error(`Invalid tag: ${options.tag}. Must be one of: ${ALLOWED_TAGS.join(', ')}`);
    return defaultResponse;
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
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching posts:", error);
      return defaultResponse;
    }

    if (!data) {
      console.log("No posts found for tag:", tag);
      return defaultResponse;
    }

    // Filter posts by tag
    const filteredPosts = data.filter(post => {
      const postTags = parseTags(post.tags);
      return postTags.includes(tag);
    });

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
    return defaultResponse;
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) {
    console.error("No slug provided");
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

    if (!data) {
      console.log("No post found for slug:", slug);
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
