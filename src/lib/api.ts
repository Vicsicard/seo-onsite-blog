import { createClient } from '@/utils/supabase/client';
import { BlogPost } from '@/types/blog';
import { marked } from 'marked';

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    envUrl: process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL ? 'Set' : 'Not set',
    envKey: process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
  });
}

console.log('[Supabase] Testing connection...');
console.log('[Supabase] URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('[Supabase] Key:', supabaseKey ? 'Set' : 'Not set');

export const supabase = createClient();

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true
});

// Function to convert markdown to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  return await marked.parse(markdown);
}

// Test database connection
(async () => {
  try {
    console.log('[Supabase] Testing database connection...');
    
    // First check if we can connect
    const { data: countData, error: countError } = await supabase
      .from('blog_posts')
      .select('count');

    if (countError) {
      console.error('[Supabase] Connection error:', {
        message: countError.message,
        code: countError.code,
        details: countError.details
      });
      throw countError;
    }

    console.log('[Supabase] Connection successful, checking data...');

    // Get all posts to check data
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*');

    if (postsError) {
      console.error('[Supabase] Error fetching posts:', postsError);
      throw postsError;
    }

    console.log('[Supabase] Database check results:', {
      totalPosts: posts?.length,
      posts: posts?.map(p => ({
        title: p.title,
        slug: p.slug,
        tags: p.tags,
        content: p.content?.substring(0, 100) + '...'
      }))
    });

  } catch (err) {
    console.error('[Supabase] Connection test failed:', err);
  }
})();

// Define default images with correct URLs
const DEFAULT_IMAGES = {
  kitchen: '/images/onsite-blog-kitchen-image-333333333.jpg',
  bathroom: '/images/onsite-blog-bathroom-image-333333333.jpg',
  general: '/images/onsite-blog-luxury-home-image-444444.jpg',
  jerome: '/images/onsite-blog-Jerome-image-333.jpg'
} as const;

interface ProcessedContent {
  imageUrl: string | null;
  cleanContent: string;
  description: string;
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

// Function to ensure URL is absolute without double-prefixing
export function ensureAbsoluteUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    // Remove any double https:// that might have been added
    const cleanUrl = url.replace(/^https?:\/\/https?:\/\//, 'https://');
    
    // If it's already absolute, return the cleaned URL
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    
    // Remove any protocol-relative format
    const withoutProtocol = cleanUrl.replace(/^\/\//, '');
    
    // Add https:// prefix
    return `https://${withoutProtocol}`;
  } catch (error) {
    console.error('[API] Invalid URL:', url, error);
    return null;
  }
}

// Function to extract and validate image URL
function extractImageFromContent(content: string): { imageUrl: string | null; cleanContent: string } {
  if (!content) {
    return { imageUrl: null, cleanContent: '' };
  }

  // Match markdown image syntax: ![alt text](url)
  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  
  let imageUrl = null;
  let cleanContent = content;
  
  if (imageMatch && imageMatch[1]) {
    imageUrl = imageMatch[1].trim();
    cleanContent = content.replace(imageMatch[0], '').trim();
  }

  // If the URL doesn't start with http/https or /, it's not valid for Next.js Image
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = null;
  }

  return {
    imageUrl,
    cleanContent
  };
}

function removeCTAText(content: string): string {
  if (!content) return '';

  // Define patterns for CTA sections and raw text
  const patterns = [
    // CTA patterns
    /Call to Action[\s\S]*?(?=\n\n|$)/gi,
    /Ready to transform[\s\S]*?(?=\n\n|$)/gi,
    /Contact us today[\s\S]*?(?=\n\n|$)/gi,
    /Get in touch[\s\S]*?(?=\n\n|$)/gi,
    /Schedule your consultation[\s\S]*?(?=\n\n|$)/gi,
    /Let's discuss[\s\S]*?(?=\n\n|$)/gi,
    /Call \(\d{3}\) \d{3}-\d{4}[\s\S]*?(?=\n\n|$)/gi,
    /Visit our showroom[\s\S]*?(?=\n\n|$)/gi,
    /Book your appointment[\s\S]*?(?=\n\n|$)/gi,
    /Start your project[\s\S]*?(?=\n\n|$)/gi,
    /Transform your[\s\S]*?(?=\n\n|$)/gi,
    /Ready for your[\s\S]*?(?=\n\n|$)/gi,
    /Take the first step[\s\S]*?(?=\n\n|$)/gi,
    /Begin your journey[\s\S]*?(?=\n\n|$)/gi,
    /Experience luxury[\s\S]*?(?=\n\n|$)/gi,
    /Discover how[\s\S]*?(?=\n\n|$)/gi,
    /Contact Jerome[\s\S]*?(?=\n\n|$)/gi,
    
    // Raw text patterns
    /New Boiler Plate[\s\S]*?(?=\n\n|$)/gi,
    /boiler plate[\s\S]*?(?=\n\n|$)/gi,
    /BOILER PLATE[\s\S]*?(?=\n\n|$)/gi,
    /raw text[\s\S]*?(?=\n\n|$)/gi,
    /RAW TEXT[\s\S]*?(?=\n\n|$)/gi,
    /Raw Text[\s\S]*?(?=\n\n|$)/gi,
    /\[raw\][\s\S]*?\[\/raw\]/gi,
    /\[boilerplate\][\s\S]*?\[\/boilerplate\]/gi,
    /\[cta\][\s\S]*?\[\/cta\]/gi,
    
    // Remove any sections that look like raw content or notes
    /(?:^|\n)Raw:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)Notes:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)TODO:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)EDIT:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)UPDATE:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)REMOVE:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)ADD:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)DRAFT:[\s\S]*?(?=\n\n|$)/gi,
    /(?:^|\n)REVISION:[\s\S]*?(?=\n\n|$)/gi,
    
    // Remove specific HTML-like tags and their content
    /\[color=[^\]]*\][\s\S]*?\[\/color\]/gi,
    /\[highlight=[^\]]*\][\s\S]*?\[\/highlight\]/gi,
    
    // Remove specific sections about contractors
    /Looking for Home Remodelers in Denver[\s\S]*?(?=\n\n|$)/gi,
    /Top Contractors Denver[\s\S]*?(?=\n\n|$)/gi,
    /info@topcontractorsdenver\.com/gi,
    /Have questions or need help[\s\S]*?(?=\n\n|$)/gi,
    /Discover why thousands[\s\S]*?(?=\n\n|$)/gi,
    
    // Remove any sections that start with common raw text markers
    /(?:^|\n)(?:\[.*?\]|<.*?>|{.*?}|\*\*.*?\*\*|##.*?##)[\s\S]*?(?=\n\n|$)/gi
  ];

  // Remove each pattern
  let cleanContent = content;
  patterns.forEach(pattern => {
    cleanContent = cleanContent.replace(pattern, '');
  });

  // Remove any trailing whitespace or newlines
  cleanContent = cleanContent.trim();

  // Remove any remaining HTML-like tags while preserving content
  cleanContent = cleanContent.replace(/\[color=[^\]]*\]|\[\/color\]/gi, '');
  cleanContent = cleanContent.replace(/\[highlight=[^\]]*\]|\[\/highlight\]/gi, '');
  
  // Remove any double newlines that might have been created
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');

  // Remove duplicate paragraphs (exact matches)
  const paragraphs = cleanContent.split('\n\n');
  const uniqueParagraphs = [...new Set(paragraphs)];
  cleanContent = uniqueParagraphs.join('\n\n');

  return cleanContent;
}

function processPostContent(content: string): ProcessedContent {
  if (!content) {
    return {
      imageUrl: null,
      cleanContent: '',
      description: ''
    };
  }

  // Extract first image and clean content
  const { imageUrl, cleanContent: contentWithoutImage } = extractImageFromContent(content);

  // Clean up the content
  let cleanContent = contentWithoutImage
    // Format sections
    .replace(/^([A-Z][^.\n]+)$/gm, '\n## $1\n')
    // Format sub-sections with numbers
    .replace(/(\d+\.\s+)([^–\n]+)(?:–|-)([^\n]+)/g, '\n### $2\n$3\n')
    // Format checkmarks
    .replace(/✔\s*/g, '✔ ')
    // Format bullet points
    .replace(/🔹\s*/g, '🔹 ')
    // Format ROI percentages
    .replace(/ROI:\s*(\d+%(?:\s*[-–]\s*\d+%)?)/g, '**ROI:** $1')
    // Format Pro Tips
    .replace(/Pro Tip:/g, '**Pro Tip:**')
    // Add proper spacing between paragraphs
    .replace(/([^\n])\n([^\n])/g, '$1\n\n$2')
    // Clean up multiple blank lines
    .replace(/\n{4,}/g, '\n\n\n')
    // Format signature
    .replace(/—\s*([^\n]+)/, '\n\n— *$1*')
    // Format contact information
    .replace(/📩\s*([^\n]+)/, '📩 [**$1**](mailto:$1)')
    .replace(/🔹\s*([^\n]+)/, '🔹 [**$1**]($1)');

  // Generate description (first paragraph, up to 200 chars)
  const description = content
    .split('\n\n')[0]
    .replace(/[#*_]/g, '')
    .substring(0, 200);

  return {
    imageUrl,
    cleanContent,
    description
  };
}

export async function fetchAllPosts({ 
  tags = '', 
  orderBy = { column: 'created_at', order: 'desc' } 
}: {
  tags?: string;
  orderBy?: { column: string; order: 'asc' | 'desc' };
} = {}) {
  console.log('[API] Fetching all posts with tags:', tags);
  
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order(orderBy.column, { ascending: orderBy.order === 'asc' });

    // Add tag filter if specified
    if (tags) {
      query = query.eq('tags', tags);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('[API] Error fetching posts:', error);
      return { posts: [], error };
    }

    if (!posts || posts.length === 0) {
      console.log('[API] No posts found');
      return { posts: [], error: null };
    }

    // Transform posts
    const transformedPosts = posts.map(post => {
      const { imageUrl, cleanContent } = extractImageFromContent(post.content || '');
      
      // Get default image based on tags
      let defaultImage = '/images/onsite-blog-luxury-home-image-444444.jpg';
      if (post.tags === 'Jerome') {
        defaultImage = '/images/onsite-blog-Jerome-image-333.jpg';
      } else if (post.tags === 'kitchenremodeling') {
        defaultImage = '/images/onsite-blog-kitchen-image-333333333.jpg';
      } else if (post.tags === 'bathroom') {
        defaultImage = '/images/onsite-blog-bathroom-image-333333333.jpg';
      }

      return {
        ...post,
        content: cleanContent,
        image_url: imageUrl || defaultImage
      };
    });

    return { posts: transformedPosts, error: null };
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return { posts: [], error };
  }
}

async function findPostBySlugOrTitle(decodedSlug: string, originalSlug: string, isTip: boolean) {
  // Normalize slugs by:
  // 1. Converting to lowercase
  // 2. Converting special quotes and dashes to standard ones
  // 3. Removing any double spaces
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")  // Convert smart quotes to regular apostrophe
      .replace(/[\u201C\u201D]/g, '"')  // Convert smart quotes to regular quotes
      .replace(/[\u2013\u2014]/g, '-')  // Convert em/en dashes to regular dash
      .replace(/\s+/g, ' ')             // Convert multiple spaces to single space
      .trim();
  };

  const normalizedDecodedSlug = normalizeText(decodedSlug);
  const normalizedOriginalSlug = normalizeText(originalSlug);

  console.log('[API] Starting post search:', {
    decodedSlug,
    originalSlug,
    normalizedDecodedSlug,
    normalizedOriginalSlug,
    isTip
  });

  // Base query with Jerome tag filter if it's a tip
  const baseQuery = supabase
    .from('blog_posts')
    .select('*');

  if (isTip) {
    baseQuery.eq('tags', 'Jerome');  // Exact match since we know the tag is stored as 'Jerome'
  }

  // Try exact matches first
  const { data: exactMatches, error: exactError } = await baseQuery
    .or(`slug.eq.'${escapeSqlValue(normalizedDecodedSlug)}',slug.eq.'${escapeSqlValue(decodedSlug)}',slug.eq.'${escapeSqlValue(originalSlug)}'`);

  if (exactError) {
    console.error('[API] Error in exact match query:', exactError);
    return null;
  }

  if (exactMatches && exactMatches.length > 0) {
    console.log('[API] Found exact match:', {
      matchedSlug: exactMatches[0].slug,
      originalTitle: exactMatches[0].title
    });
    return exactMatches[0];
  }

  // Try case-insensitive search
  const { data: slugMatches, error: slugError } = await baseQuery
    .or(`slug.ilike.'%${escapeSqlValue(normalizedDecodedSlug)}%',slug.ilike.'%${escapeSqlValue(decodedSlug)}%'`);

  if (slugError) {
    console.error('[API] Error in slug search:', slugError);
    return null;
  }

  if (slugMatches && slugMatches.length > 0) {
    console.log('[API] Found case-insensitive match:', {
      matchedSlug: slugMatches[0].slug,
      originalTitle: slugMatches[0].title
    });
    return slugMatches[0];
  }

  // Try title search as last resort
  const searchTitle = decodedSlug.replace(/-/g, ' ').trim();
  const normalizedSearchTitle = normalizeText(searchTitle);

  const { data: titleMatches, error: titleError } = await baseQuery
    .ilike('title', `%${escapeSqlValue(normalizedSearchTitle)}%`);

  if (titleError) {
    console.error('[API] Error in title search:', titleError);
    return null;
  }

  if (titleMatches && titleMatches.length > 0) {
    console.log('[API] Found match by title:', {
      searchTitle: normalizedSearchTitle,
      matchedTitle: titleMatches[0].title,
      matchedSlug: titleMatches[0].slug
    });
    return titleMatches[0];
  }

  console.log('[API] No matches found for:', {
    decodedSlug,
    originalSlug,
    normalizedDecodedSlug,
    normalizedOriginalSlug,
    searchTitle: normalizedSearchTitle,
    isTip
  });
  return null;
}

export async function fetchPosts(exactTag: string, start: number = 0, end: number = 9) {
  console.log(`[API] Fetching posts for tag: ${exactTag}, range: ${start}-${end}`);

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('tags', exactTag)  // Use exact match for tags
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('[API] Error fetching posts:', error);
      return { posts: [], error };
    }

    if (!posts || posts.length === 0) {
      console.log(`[API] No posts found for tag: ${exactTag}`);
      return { posts: [], error: null };
    }

    // Transform posts
    const transformedPosts = posts.map(post => {
      const { imageUrl, cleanContent } = extractImageFromContent(post.content || '');

      // Get default image based on tags
      let defaultImage = '/images/onsite-blog-luxury-home-image-444444.jpg';
      if (post.tags === 'Jerome') {
        defaultImage = '/images/onsite-blog-Jerome-image-333.jpg';
      } else if (post.tags === 'kitchenremodeling') {
        defaultImage = '/images/onsite-blog-kitchen-image-333333333.jpg';
      } else if (post.tags === 'bathroom') {
        defaultImage = '/images/onsite-blog-bathroom-image-333333333.jpg';
      }

      return {
        ...post,
        content: cleanContent,
        image_url: imageUrl || defaultImage
      };
    });

    return { posts: transformedPosts, error: null };
  } catch (err) {
    console.error('[API] Error in fetchPosts:', err);
    return { posts: [], error: err as Error };
  }
}

function escapeSqlValue(value: string): string {
  return value.replace(/'/g, "''");
}

function extractFirstImageUrl(content: string): string | null {
  // Try markdown image syntax first
  const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (markdownMatch) {
    return markdownMatch[1];
  }

  // Try HTML img tag
  const htmlMatch = content.match(/<img.*?src=["'](.*?)["']/);
  if (htmlMatch) {
    return htmlMatch[1];
  }

  return null;
}

export async function fetchPostBySlug(slug: string, isTip: boolean = false) {
  console.log('[fetchPostBySlug] Starting with:', { 
    slug,
    isTip,
  });

  try {
    // First decode any URL-encoded characters
    let decodedSlug = '';
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {
      console.error('[fetchPostBySlug] Error decoding slug:', e);
      decodedSlug = slug;
    }

    // Remove any query parameters or hash fragments and clean up
    const cleanSlug = decodedSlug
      .split(/[?#]/)[0]
      .replace(/['']/g, "'")
      .toLowerCase()
      .trim();

    console.log('[fetchPostBySlug] Slug processing:', { 
      original: slug,
      decoded: decodedSlug,
      clean: cleanSlug
    });

    // Try to find the post using exact match
    const { data: posts, error: dbError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', cleanSlug)
      .limit(1);

    if (dbError) {
      console.error('[fetchPostBySlug] Database error:', dbError);
      return { post: null, error: dbError };
    }

    if (!posts?.length) {
      console.log('[fetchPostBySlug] No post found for slug:', cleanSlug);
      // Try a more flexible search if exact match fails
      const { data: fuzzyPosts, error: fuzzyError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fuzzyError || !fuzzyPosts?.length) {
        return { post: null, error: new Error('Post not found') };
      }

      // Find the most similar post
      const post = fuzzyPosts.find(p => 
        p.slug.toLowerCase().includes(cleanSlug.toLowerCase()) ||
        cleanSlug.toLowerCase().includes(p.slug.toLowerCase()) ||
        p.content.toLowerCase().includes(cleanSlug.toLowerCase()) ||
        cleanSlug.toLowerCase().includes(p.content.toLowerCase())
      );

      if (!post) {
        return { post: null, error: new Error('Post not found') };
      }

      // Extract first image from content if no image_url is provided
      const contentImageUrl = post.image_url || extractFirstImageUrl(post.content || '');

      return {
        post: {
          ...post,
          content: post.content,
          image_url: contentImageUrl || '/images/onsite-blog-luxury-home-image-444444.jpg'
        },
        error: null
      };

    } else {
      // Get the first matching post
      const post = posts[0];

      // Extract first image from content if no image_url is provided
      const contentImageUrl = post.image_url || extractFirstImageUrl(post.content || '');

      // Return the processed post
      return {
        post: {
          ...post,
          content: post.content,
          image_url: contentImageUrl || '/images/onsite-blog-luxury-home-image-444444.jpg'
        },
        error: null
      };
    }

  } catch (err) {
    console.error('[fetchPostBySlug] Error:', err);
    return { post: null, error: err as Error };
  }
}
