import { createClient } from '@supabase/supabase-js';
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

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase.from('blog_posts').select('count');
    if (error) {
      console.error('[Supabase] Connection error:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
    console.log('[Supabase] Connection successful, post count:', data?.[0]?.count);
  } catch (err) {
    console.error('[Supabase] Connection error:', err);
  }
})();

// Define default images with correct URLs
const DEFAULT_IMAGES = {
  kitchen: '/images/onsite-blog-kitchen-image-333333333.jpg',
  bathroom: '/images/onsite-blog-bathroom-image-333333.jpg',
  general: '/images/onsite-blog-luxury-home-image-444444.jpg'
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

// Function to extract image URL from content
export function extractImageFromContent(content: string): { imageUrl: string | null; cleanContent: string } {
  try {
    // Default return value
    const defaultResult = { imageUrl: null, cleanContent: content };

    if (!content) {
      console.log('[API] No content to extract image from');
      return defaultResult;
    }

    // Try multiple patterns to find images in the content
    // Pattern 1: Standard Markdown image syntax: ![alt text](url)
    const markdownImgMatch = content.match(/!\[.*?\]\((.*?)\)/);
    
    // Pattern 2: HTML img tag: <img src="url" ... />
    const htmlImgMatch = content.match(/<img.*?src=["'](.*?)["']/i);
    
    // Pattern 3: Relative path in quotes: "/images/something.jpg"
    const quotedImgMatch = content.match(/["'](\/images\/.*?\.(?:jpe?g|png|gif|webp))["']/i);

    let imageUrl = null;
    let matchText = '';

    // Use the first successful match
    if (markdownImgMatch) {
      imageUrl = markdownImgMatch[1];
      matchText = markdownImgMatch[0];
      console.log('[API] Found Markdown image:', imageUrl);
    } else if (htmlImgMatch) {
      imageUrl = htmlImgMatch[1];
      matchText = htmlImgMatch[0];
      console.log('[API] Found HTML image:', imageUrl);
    } else if (quotedImgMatch) {
      imageUrl = quotedImgMatch[1];
      matchText = quotedImgMatch[0];
      console.log('[API] Found quoted image path:', imageUrl);
    } else {
      console.log('[API] No image found in content');
      return defaultResult;
    }

    // Process the URL to ensure it's valid
    const processedUrl = ensureAbsoluteUrl(imageUrl);
    
    // Remove the first found image reference from content
    // This is optional - you might want to keep the image in the content
    const cleanContent = content.replace(matchText, '').trim();

    console.log('[API] Extracted image URL:', { original: imageUrl, processed: processedUrl });
    return { imageUrl: processedUrl, cleanContent };
  } catch (error) {
    console.error('[API] Error extracting image from content:', error);
    return { imageUrl: null, cleanContent: content };
  }
}

// Function to remove CTA text from content
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
  // Initialize result
  const result: ProcessedContent = {
    imageUrl: null,
    cleanContent: content,
    description: ''
  };

  try {
    // Extract image URL using a more robust regex
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const imgMatch = content.match(imgRegex);
    
    if (imgMatch && imgMatch[1]) {
      // Store the found image URL
      result.imageUrl = ensureAbsoluteUrl(imgMatch[1]);
      
      // Remove the entire img tag and its container paragraph if it exists
      result.cleanContent = content
        .replace(/<p>\s*<img[^>]+>\s*<\/p>/, '') // Remove if wrapped in <p>
        .replace(/<img[^>]+>/, '')               // Remove standalone img tag
        .trim();
    }

    // Extract description (first paragraph without image)
    const paragraphRegex = /<p[^>]*>((?!<img)[^<]+)<\/p>/i;
    const paragraphMatch = result.cleanContent.match(paragraphRegex);
    
    if (paragraphMatch && paragraphMatch[1]) {
      // Use the first paragraph as description, clean any HTML entities
      result.description = paragraphMatch[1]
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
    }

    // Log the results for debugging
    console.log('[Content Processing]', {
      foundImage: !!result.imageUrl,
      imageUrl: result.imageUrl,
      descriptionLength: result.description.length,
      cleanContentLength: result.cleanContent.length
    });

    return result;
  } catch (err) {
    console.error('[Content Processing] Error:', err);
    return result;
  }
}

export async function fetchAllPosts({ 
  tags = [], 
  orderBy = { column: 'published_at', order: 'desc' } 
}: {
  tags?: string[];
  orderBy?: { column: string; order: 'asc' | 'desc' };
} = {}) {
  console.log('[fetchAllPosts] Starting with params:', { tags, orderBy });

  try {
    let query = supabase
      .from('blog_posts')
      .select('*');

    // Add tag filtering if specified
    if (tags.length > 0) {
      // For Jerome tag, use exact match
      if (tags.includes('Jerome')) {
        query = query.eq('tags', 'Jerome');
      } else {
        // For other tags, use ILIKE
        const tagConditions = tags.map(tag => `tags ilike '%${tag}%'`);
        query = query.or(tagConditions.join(','));
      }
    }

    // Add ordering
    query = query.order(orderBy.column, { ascending: orderBy.order === 'asc' });

    const { data: posts, error } = await query;

    if (error) {
      console.error('[fetchAllPosts] Database error:', error);
      return { posts: null, error: 'Failed to fetch posts' };
    }

    if (!posts?.length) {
      console.log('[fetchAllPosts] No posts found');
      return { posts: [], error: null };
    }

    // Process posts to ensure image_url is set
    const processedPosts = posts.map(post => {
      let imageUrl = post.image_url;
      
      // If no image_url, try to extract from content
      if (!imageUrl && post.content) {
        try {
          const { imageUrl: extractedUrl } = extractImageFromContent(post.content);
          if (extractedUrl) {
            console.log('[fetchAllPosts] Extracted image from content:', extractedUrl);
            imageUrl = extractedUrl;
          }
        } catch (error) {
          console.error('[fetchAllPosts] Error extracting image from content:', error);
        }
      }

      // If still no image, use default based on tags
      if (!imageUrl) {
        if (post.tags === 'Jerome') {
          imageUrl = '/images/onsite-blog-Jerome-image-333.jpg';
        } else if (post.tags?.toLowerCase().includes('kitchen')) {
          imageUrl = '/images/onsite-blog-kitchen-image-333333333.jpg';
        } else if (post.tags?.toLowerCase().includes('bathroom')) {
          imageUrl = '/images/onsite-blog-bathroom-image-333333.jpg';
        } else {
          imageUrl = '/images/onsite-blog-luxury-home-image-444444.jpg';
        }
        console.log('[fetchAllPosts] Using default image based on tag:', { tag: post.tags, image: imageUrl });
      }

      return {
        ...post,
        image_url: imageUrl
      };
    });

    console.log('[fetchAllPosts] Success:', { 
      count: processedPosts.length,
      posts: processedPosts.map(p => ({ 
        id: p.id, 
        title: p.title,
        slug: p.slug,
        tags: p.tags,
        hasImage: !!p.image_url 
      }))
    });

    return { posts: processedPosts, error: null };
  } catch (error) {
    console.error('[fetchAllPosts] Error:', error);
    return { posts: null, error: 'Failed to fetch posts' };
  }
}

export async function fetchPostBySlug(slug: string, isTip: boolean = false) {
  console.log('[fetchPostBySlug] Starting with:', { 
    slug,
    isTip,
    slugCharCodes: [...slug].map(c => ({ char: c, code: c.charCodeAt(0) }))
  });

  try {
    // First decode the URL-encoded string
    const urlDecoded = decodeURIComponent(slug);
    console.log('[fetchPostBySlug] After URL decode:', { 
      urlDecoded,
      decodedCharCodes: [...urlDecoded].map(c => ({ char: c, code: c.charCodeAt(0) }))
    });

    // First try an exact match with the decoded slug
    let query = supabase
      .from('blog_posts')
      .select('*')
      .ilike('slug', urlDecoded);  // Case-insensitive match for slug

    // If this is a tip, only get posts with Jerome tag
    if (isTip) {
      query = query.eq('tags', 'Jerome');  // Exact match for Jerome tag
    }

    let { data: posts, error: dbError } = await query;

    console.log('[fetchPostBySlug] Query result:', {
      success: !dbError,
      hasPost: !!posts?.length,
      error: dbError,
      querySlug: urlDecoded,
      posts: posts?.map(p => ({
        slug: p.slug,
        tags: p.tags
      }))
    });

    if (dbError) {
      console.error('[fetchPostBySlug] Database error:', dbError);
      return { post: null, error: 'Post not found' };
    }

    if (!posts?.length) {
      // Try with normalized characters
      const normalizedSlug = urlDecoded
        .replace(/[\u2014\u2013]/g, '-')  // Normalize all dash variants
        .replace(/[\u2019\u2018]/g, "'")  // Normalize all apostrophe variants
        .replace(/-+/g, '-')               // Replace multiple dashes with single dash
        .replace(/^-+|-+$/g, '')          // Remove leading/trailing dashes
        .toLowerCase();                    // Ensure lowercase

      console.log('[fetchPostBySlug] Trying normalized slug:', {
        normalizedSlug,
        normalizedCharCodes: [...normalizedSlug].map(c => ({ char: c, code: c.charCodeAt(0) }))
      });

      const { data: normalizedPosts, error: normalizedError } = await supabase
        .from('blog_posts')
        .select('*')
        .ilike('slug', normalizedSlug)
        .eq('tags', isTip ? 'Jerome' : normalizedSlug);  // Exact match for Jerome tag

      if (normalizedError) {
        console.error('[fetchPostBySlug] Error with normalized slug:', normalizedError);
        return { post: null, error: 'Post not found' };
      }

      posts = normalizedPosts;
    }

    if (!posts?.length) {
      console.log('[fetchPostBySlug] No post found with either slug');
      return { post: null, error: 'Post not found' };
    }

    const nonNullablePost = posts[0];

    // For tips, verify it has the Jerome tag
    if (isTip && nonNullablePost.tags !== 'Jerome') {
      console.log('[fetchPostBySlug] Post found but not a Jerome tip:', nonNullablePost.tags);
      return { post: null, error: 'Post not found' };
    }

    // Process the post
    const post = nonNullablePost;
    
    // Process content if it exists
    if (post.content) {
      const { cleanContent, description, imageUrl: extractedImageUrl } = processPostContent(post.content);
      post.content = cleanContent;
      
      // Use extracted image if the post doesn't already have one
      if (!post.image_url && extractedImageUrl) {
        post.image_url = extractedImageUrl;
        console.log('[fetchPostBySlug] Using image extracted from content:', extractedImageUrl);
      }
      
      // Set description if not already set
      if (!post.description) {
        post.description = description;
      }
    }
    
    // Use default image if none set
    if (!post.image_url) {
      if (post.tags === 'Jerome') {
        post.image_url = '/images/onsite-blog-Jerome-image-333.jpg';
      } else if (post.tags?.toLowerCase().includes('kitchen')) {
        post.image_url = '/images/onsite-blog-kitchen-image-333333333.jpg';
      } else if (post.tags?.toLowerCase().includes('bathroom')) {
        post.image_url = '/images/onsite-blog-bathroom-image-333333.jpg';
      } else {
        post.image_url = '/images/onsite-blog-luxury-home-image-444444.jpg';
      }
      console.log('[fetchPostBySlug] Using default image based on tag:', { tag: post.tags, image: post.image_url });
    }

    console.log('[fetchPostBySlug] Successfully processed post:', {
      title: post.title,
      slug: post.slug,
      hasContent: !!post.content,
      tags: post.tags,
      imageUrl: post.image_url
    });

    return { post, error: null };
  } catch (error) {
    console.error('[fetchPostBySlug] Unexpected error:', error);
    return { post: null, error: 'Post not found' };
  }
}

function escapeSqlValue(value: string): string {
  return value.replace(/'/g, "''");
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
      let content = post.content || '';
      
      // Special handling for kitchen posts
      if (exactTag === 'kitchenremodeling') {
        // Remove the raw text section
        const conclusionIndex = content.indexOf('Conclusion');
        if (conclusionIndex !== -1) {
          const lookingForIndex = content.indexOf('Looking for Home Remodelers in Denver', conclusionIndex);
          if (lookingForIndex !== -1) {
            content = content.substring(0, lookingForIndex).trim();
          }
        }
      }

      // Extract image from content
      const { imageUrl } = extractImageFromContent(content);
      
      // Ensure image URL is properly formatted
      let finalImageUrl = imageUrl;
      if (finalImageUrl && !finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('/')) {
        finalImageUrl = '/' + finalImageUrl;
      }
      
      return {
        ...post,
        content,
        image_url: finalImageUrl || (exactTag === 'Jerome' 
          ? '/images/onsite-blog-Jerome-image-333.jpg'
          : DEFAULT_IMAGES[exactTag === 'kitchenremodeling' ? 'kitchen' :
                         exactTag === 'bathroom' ? 'bathroom' :
                         'general'])
      } as BlogPost;
    });

    return { posts: transformedPosts, error: null };
  } catch (err) {
    console.error('[API] Error in fetchPosts:', err);
    return { posts: [], error: err as Error };
  }
}
