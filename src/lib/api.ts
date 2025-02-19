import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '@/types/blog';

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

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Map of default images for each tag
const DEFAULT_IMAGES = {
  kitchen: 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-kitchen-image-333333333.jpg',
  bathroom: 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-bathroom-image-333333.jpg',
  general: 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-default-image-333333.jpg'
};

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

function extractImageFromContent(content: string): { imageUrl: string | null, cleanContent: string } {
  if (!content || typeof content !== 'string') {
    console.log('[Content] Invalid content:', content);
    return {
      imageUrl: null,
      cleanContent: content || ''
    };
  }

  try {
    // First try to find Markdown image syntax
    const mdImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    
    if (mdImageMatch) {
      const [fullMatch, alt, imageUrl] = mdImageMatch;
      console.log('[Content] Found Markdown image:', {
        alt,
        imageUrl
      });
      
      if (isValidImageUrl(imageUrl)) {
        return {
          imageUrl,
          cleanContent: content.replace(fullMatch, '').trim()
        };
      }
    }

    // Fallback to HTML image tag if no Markdown image found
    const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    
    if (htmlImageMatch) {
      const imageUrl = htmlImageMatch[1];
      console.log('[Content] Found HTML image:', imageUrl);
      
      if (isValidImageUrl(imageUrl)) {
        return {
          imageUrl,
          cleanContent: content.replace(htmlImageMatch[0], '').trim()
        };
      }
    }

    console.log('[Content] No valid image found in content');
    return {
      imageUrl: null,
      cleanContent: content
    };
  } catch (err) {
    console.error('[Content] Failed to extract image:', err);
    return {
      imageUrl: null,
      cleanContent: content
    };
  }
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
      result.imageUrl = imgMatch[1];
      
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

function removeCTAText(content: string): string {
  if (!content) return '';

  // Define patterns for CTA sections
  const ctaPatterns = [
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
    /New Boiler Plate[\s\S]*?(?=\n\n|$)/gi,
    /boiler plate[\s\S]*?(?=\n\n|$)/gi,
    /BOILER PLATE[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Call to Action\*\*[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Ready to transform[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Contact us today[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Get in touch[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Schedule your consultation[\s\S]*?(?=\n\n|$)/gi,
    /\*\*Let's discuss[\s\S]*?(?=\n\n|$)/gi
  ];

  // Remove each CTA pattern
  let cleanContent = content;
  ctaPatterns.forEach(pattern => {
    cleanContent = cleanContent.replace(pattern, '');
  });

  // Remove any trailing whitespace or newlines
  cleanContent = cleanContent.trim();

  // Remove any remaining boilerplate sections
  cleanContent = cleanContent.replace(/(?:^|\n)(?:Call to Action|Ready to transform|Contact us today|Get in touch|Schedule your consultation|Let's discuss|Call \(\d{3}\) \d{3}-\d{4}|Visit our showroom|Book your appointment|Start your project|Transform your|Ready for your|Take the first step|Begin your journey|Experience luxury|Discover how|Contact Jerome|New Boiler Plate|boiler plate|BOILER PLATE)[\s\S]*?(?=\n\n|$)/gi, '');

  // Remove any double newlines that might have been created
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');

  return cleanContent;
}

export async function fetchPostsByTag({ tag, page = 1, limit = 9 }: { tag: string; page?: number; limit?: number }) {
  if (!tag) {
    console.error('[API] Tag is required');
    return { posts: [], error: new Error('Tag is required') };
  }

  // Ensure exact match for "Jerome" tag
  const exactTag = tag.toLowerCase() === 'jerome' ? 'Jerome' : tag;
  console.log(`[API] Fetching posts with tag: ${exactTag}, page: ${page}, limit: ${limit}`);
  
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    // Use exact match for "Jerome" tag, case-sensitive
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .ilike('tags', `%${exactTag}%`)  // Use case-insensitive match
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

    console.log(`[API] Found ${posts.length} posts with tag "${exactTag}"`);
    posts.forEach(post => {
      console.log(`[API] Post "${post.title}":`, {
        tags: post.tags,
        contentLength: post.content?.length
      });
    });

    // Transform posts to extract image URLs and clean content
    const processedPosts = posts.map(post => {
      if (!post.content) {
        console.log(`[API] Post "${post.title}" has no content`);
        return {
          ...post,
          content: '',
          image_url: DEFAULT_IMAGES[tag.toLowerCase()] || DEFAULT_IMAGES.home
        };
      }

      const { imageUrl, cleanContent } = extractImageFromContent(post.content);
      const contentWithoutCTA = removeCTAText(cleanContent);

      const defaultImage = DEFAULT_IMAGES[tag.toLowerCase()] || DEFAULT_IMAGES.home;
      const finalImageUrl = imageUrl && isValidImageUrl(imageUrl) ? imageUrl : defaultImage;
      
      console.log(`[API] Processed post "${post.title}":`, {
        hasImage: !!imageUrl,
        imageUrl: finalImageUrl,
        originalLength: post.content.length,
        cleanedLength: contentWithoutCTA.length
      });

      return {
        ...post,
        content: contentWithoutCTA,
        image_url: finalImageUrl
      };
    });

    return { posts: processedPosts, error: null };
  } catch (err) {
    console.error('[API] Error processing posts:', err);
    return { posts: [], error: err as Error };
  }
}

export async function fetchPostBySlug(slug: string, isTip: boolean = false) {
  console.log(`[API] START fetchPostBySlug - slug: ${slug}, isTip: ${isTip}`);

  try {
    // Build the query
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug);

    // If it's a tip, add the jerome tag filter
    if (isTip) {
      query = query.or('tags.cs.{jerome},tags.ilike.%"jerome"%,tags.ilike.%jerome%');
    }

    const { data: post, error } = await query.single();

    if (error) {
      console.error('[API] Database error:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      return { post: null, error };
    }

    if (!post) {
      console.log(`[API] No post found - slug: ${slug}, isTip: ${isTip}`);
      return { post: null, error: new Error('Post not found') };
    }

    // For tips, verify it has the jerome tag
    if (isTip && !post.tags?.toLowerCase().includes('jerome')) {
      console.log(`[API] Post found but doesn't have jerome tag:`, {
        slug,
        tags: post.tags
      });
      return { post: null, error: new Error('Post not found') };
    }

    if (!post.content) {
      console.log('[API] Post has no content:', {
        id: post.id,
        slug: post.slug,
        title: post.title
      });
      return {
        post: {
          ...post,
          content: '',
          image_url: isTip 
            ? 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg'
            : DEFAULT_IMAGES[post.tags?.toLowerCase().includes('kitchen') ? 'kitchen' :
                           post.tags?.toLowerCase().includes('bathroom') ? 'bathroom' :
                           'home']
        } as BlogPost,
        error: null
      };
    }

    // Extract image and clean content
    const { imageUrl, cleanContent } = extractImageFromContent(post.content);
    const contentWithoutCTA = removeCTAText(cleanContent);

    // Create transformed post
    const transformedPost = {
      ...post,
      content: contentWithoutCTA || '',
      image_url: imageUrl || (isTip 
        ? 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg'
        : DEFAULT_IMAGES[post.tags?.toLowerCase().includes('kitchen') ? 'kitchen' :
                       post.tags?.toLowerCase().includes('bathroom') ? 'bathroom' :
                       'home'])
    } as BlogPost;

    return { post: transformedPost, error: null };
  } catch (err) {
    console.error('[API] Error in fetchPostBySlug:', err);
    return { post: null, error: err as Error };
  }
}

export async function fetchAllPosts({ page = 1, limit = 9 }: { page?: number; limit?: number }) {
  console.log(`[API] Fetching all posts, page: ${page}, limit: ${limit}`);
  
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('[API] Error fetching posts:', error);
      return { posts: [], error };
    }

    if (!posts || posts.length === 0) {
      console.log('[API] No posts found');
      return { posts: [], error: null };
    }

    // Log raw post data
    console.log('[API] Raw posts data:', JSON.stringify(posts, null, 2));

    // Transform posts to extract image URLs and clean content
    const transformedPosts = posts.map(post => {
      console.log(`\n[API] Processing post "${post.title}" (ID: ${post.id}):`);
      console.log('Raw content:', post.content);

      const { imageUrl, cleanContent, description } = post.content 
        ? processPostContent(post.content)
        : { imageUrl: null, cleanContent: '', description: '' };

      // Determine tag for default image
      const tag = post.tags?.toLowerCase().includes('kitchen') ? 'kitchen' :
                 post.tags?.toLowerCase().includes('bathroom') ? 'bathroom' :
                 'home';

      const finalPost = {
        ...post,
        content: cleanContent,
        description: description,
        image_url: imageUrl || DEFAULT_IMAGES[tag]
      };

      console.log('Transformed post:', {
        title: finalPost.title,
        image_url: finalPost.image_url,
        content_length: finalPost.content.length
      });

      return finalPost;
    }) as BlogPost[];

    return { posts: transformedPosts, error: null };
  } catch (err) {
    console.error('[API] Unexpected error:', err);
    return { posts: [], error: err as Error };
  }
}

export async function fetchPosts(exactTag: string, start: number = 0, end: number = 9) {
  console.log(`[API] Fetching posts for tag: ${exactTag}, range: ${start}-${end}`);

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .ilike('tags', `%${exactTag}%`)  // Use case-insensitive match
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
      const { imageUrl } = extractImageFromContent(post.content || '');
      
      return {
        ...post,
        image_url: imageUrl || (exactTag === 'jerome' 
          ? 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg'
          : DEFAULT_IMAGES[post.tags?.toLowerCase().includes('kitchen') ? 'kitchen' :
                         post.tags?.toLowerCase().includes('bathroom') ? 'bathroom' :
                         'home'])
      } as BlogPost;
    });

    return { posts: transformedPosts, error: null };
  } catch (err) {
    console.error('[API] Error in fetchPosts:', err);
    return { posts: [], error: err as Error };
  }
}
