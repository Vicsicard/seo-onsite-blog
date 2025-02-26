// Script to verify image URLs in all blog posts
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioxyvgkpkgkpiwfgcjhx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHl2Z2twa2drcGl3Zmdnamh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MTEzMTksImV4cCI6MjAwNDI4NzMxOX0.YPOtPJJCwcF2UX4L8mjbhbqnXPUY4WHiLaH4NROlCyk';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle protocol-relative URLs
function ensureAbsoluteUrl(url) {
  if (!url) return null;

  try {
    // Remove any double https:// that might have been added
    const cleanUrl = url.replace(/^https?:\/\/https?:\/\//, 'https://');
    
    // If it's already absolute, return the cleaned URL
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    
    // Handle protocol-relative URLs
    if (cleanUrl.startsWith('//')) {
      return `https:${cleanUrl}`;
    }
    
    // Must be a relative URL, add domain if needed
    return cleanUrl;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return null;
  }
}

// Function to extract image from content
function extractImageFromContent(content) {
  if (!content) return null;
  
  try {
    // Try multiple patterns to find images
    const markdownPattern = /!\[.*?\]\((.*?)\)/;
    const htmlPattern = /<img.*?src=["'](.*?)["']/i;
    
    let match = content.match(markdownPattern);
    if (match) return match[1];
    
    match = content.match(htmlPattern);
    if (match) return match[1];
    
    return null;
  } catch (error) {
    console.error('Error extracting image from content:', error);
    return null;
  }
}

// Get the appropriate default image based on tags
function getDefaultImage(tags) {
  if (!tags) return '/images/onsite-blog-luxury-home-image-444444.jpg';
  
  if (tags === 'Jerome') {
    return '/images/onsite-blog-Jerome-image-333.jpg';
  } else if (tags.toLowerCase().includes('kitchen')) {
    return '/images/onsite-blog-kitchen-image-333333333.jpg';
  } else if (tags.toLowerCase().includes('bathroom')) {
    return '/images/onsite-blog-bathroom-image-333333.jpg';
  } else {
    return '/images/onsite-blog-luxury-home-image-444444.jpg';
  }
}

// Main function to fetch and analyze blog posts
async function verifyBlogPostImages() {
  try {
    console.log('Starting blog post image verification...');
    
    // Define allowed tags
    const allowedTags = ['homeremodeling', 'bathroomremodeling', 'kitchenremodeling', 'Jerome'];
    
    // Fetch all blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${posts.length} total blog posts`);
    
    // Filter posts with allowed tags
    const filteredPosts = posts.filter(post => {
      const tags = post.tags || '';
      return allowedTags.some(tag => tags.toLowerCase().includes(tag.toLowerCase()));
    });
    
    console.log(`Found ${filteredPosts.length} posts with allowed tags`);
    
    // Analyze image URLs in each post
    const imageStats = {
      hasExplicitImageUrl: 0,
      extractedFromContent: 0,
      usingDefaultImage: 0,
      protocolRelativeUrls: 0,
      absoluteUrls: 0,
      relativeUrls: 0,
      bubbleCdnUrls: 0
    };
    
    const postsWithIssues = [];
    
    for (const post of filteredPosts) {
      const postInfo = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        tags: post.tags,
        image_url: post.image_url,
        contentHasImage: false,
        finalImageUrl: null,
        issues: []
      };
      
      // Check for explicit image_url
      if (post.image_url) {
        imageStats.hasExplicitImageUrl++;
        postInfo.finalImageUrl = post.image_url;
        
        // Analyze the URL format
        if (post.image_url.startsWith('//')) {
          imageStats.protocolRelativeUrls++;
          postInfo.issues.push('Protocol-relative URL');
        } else if (post.image_url.startsWith('http')) {
          imageStats.absoluteUrls++;
        } else {
          imageStats.relativeUrls++;
        }
        
        if (post.image_url.includes('cdn.bubble.io')) {
          imageStats.bubbleCdnUrls++;
          postInfo.issues.push('Uses Bubble CDN');
        }
      } 
      // Try to extract from content if no explicit image_url
      else if (post.content) {
        const extractedUrl = extractImageFromContent(post.content);
        if (extractedUrl) {
          imageStats.extractedFromContent++;
          postInfo.finalImageUrl = extractedUrl;
          postInfo.contentHasImage = true;
          
          // Analyze the extracted URL format
          if (extractedUrl.startsWith('//')) {
            imageStats.protocolRelativeUrls++;
            postInfo.issues.push('Protocol-relative URL extracted from content');
          } else if (extractedUrl.startsWith('http')) {
            imageStats.absoluteUrls++;
          } else {
            imageStats.relativeUrls++;
          }
          
          if (extractedUrl.includes('cdn.bubble.io')) {
            imageStats.bubbleCdnUrls++;
            postInfo.issues.push('Uses Bubble CDN from content');
          }
        } 
        // Use default image if no image in content
        else {
          imageStats.usingDefaultImage++;
          postInfo.finalImageUrl = getDefaultImage(post.tags);
          postInfo.issues.push('Using default image');
        }
      } 
      // Use default image if no image_url and no content
      else {
        imageStats.usingDefaultImage++;
        postInfo.finalImageUrl = getDefaultImage(post.tags);
        postInfo.issues.push('No content, using default image');
      }
      
      // Check if there are any issues
      if (postInfo.issues.length > 0) {
        postsWithIssues.push(postInfo);
      }
    }
    
    // Print summary
    console.log('\n--- IMAGE URL STATISTICS ---');
    console.log(`Total posts with allowed tags: ${filteredPosts.length}`);
    console.log(`Posts with explicit image_url: ${imageStats.hasExplicitImageUrl}`);
    console.log(`Posts with image extracted from content: ${imageStats.extractedFromContent}`);
    console.log(`Posts using default image: ${imageStats.usingDefaultImage}`);
    console.log('\n--- URL FORMAT STATISTICS ---');
    console.log(`Protocol-relative URLs: ${imageStats.protocolRelativeUrls}`);
    console.log(`Absolute URLs: ${imageStats.absoluteUrls}`);
    console.log(`Relative URLs: ${imageStats.relativeUrls}`);
    console.log(`Bubble CDN URLs: ${imageStats.bubbleCdnUrls}`);
    
    // Print posts with issues
    console.log('\n--- POSTS WITH ISSUES ---');
    postsWithIssues.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title} (${post.slug})`);
      console.log(`   Tags: ${post.tags}`);
      console.log(`   Image URL: ${post.image_url || 'None'}`);
      console.log(`   Final Image URL: ${post.finalImageUrl}`);
      console.log(`   Issues: ${post.issues.join(', ')}`);
    });
    
    console.log('\nImage verification complete!');
  } catch (error) {
    console.error('Error verifying blog post images:', error);
  }
}

// Run the main function
verifyBlogPostImages();
