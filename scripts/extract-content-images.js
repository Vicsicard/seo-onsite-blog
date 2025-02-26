require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to extract image URL from content
function extractImageFromContent(content) {
  try {
    // Default return value
    if (!content) {
      console.log('No content to extract image from');
      return { imageUrl: null, cleanContent: content };
    }

    console.log('\nTrying to extract image from content snippet:');
    console.log(content.substring(0, 300) + '...');

    // Try multiple patterns to find images in the content
    // Pattern 1: Standard Markdown image syntax: ![alt text](url)
    const markdownImgMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownImgMatch) {
      console.log('Found Markdown image:', markdownImgMatch[1]);
      console.log('Full match:', markdownImgMatch[0]);
      return { imageUrl: markdownImgMatch[1], matchType: 'markdown' };
    }
    
    // Pattern 2: HTML img tag: <img src="url" ... />
    const htmlImgMatch = content.match(/<img.*?src=["'](.*?)["']/i);
    if (htmlImgMatch) {
      console.log('Found HTML image:', htmlImgMatch[1]);
      console.log('Full match:', htmlImgMatch[0]);
      return { imageUrl: htmlImgMatch[1], matchType: 'html' };
    }
    
    // Pattern 3: Relative path in quotes: "/images/something.jpg"
    const quotedImgMatch = content.match(/["'](\/images\/.*?\.(?:jpe?g|png|gif|webp))["']/i);
    if (quotedImgMatch) {
      console.log('Found quoted image path:', quotedImgMatch[1]);
      console.log('Full match:', quotedImgMatch[0]);
      return { imageUrl: quotedImgMatch[1], matchType: 'quoted' };
    }

    console.log('No image found in content');
    return { imageUrl: null, matchType: 'none' };
  } catch (error) {
    console.error('Error extracting image from content:', error);
    return { imageUrl: null, matchType: 'error' };
  }
}

async function checkContentImages() {
  try {
    console.log('Fetching posts from Supabase...');
    
    // Fetch all posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, tags, content')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    
    console.log(`Fetched ${posts.length} posts from database.\n`);
    
    // Analyze posts by tag
    const byTag = {};
    
    for (const post of posts) {
      const tag = post.tags || 'untagged';
      
      if (!byTag[tag]) {
        byTag[tag] = {
          posts: [],
          withImages: 0,
          withoutImages: 0
        };
      }
      
      const { imageUrl, matchType } = extractImageFromContent(post.content);
      
      byTag[tag].posts.push({
        id: post.id,
        title: post.title,
        hasImage: !!imageUrl,
        imageUrl,
        matchType
      });
      
      if (imageUrl) {
        byTag[tag].withImages++;
      } else {
        byTag[tag].withoutImages++;
      }
      
      console.log(`\nPost ID: ${post.id} | Title: ${post.title} | Tag: ${tag}`);
      console.log(`Image URL: ${imageUrl || 'None'} | Match Type: ${matchType}`);
      console.log('--------------------------------------------');
    }
    
    // Print summary
    console.log('\n=== SUMMARY ===');
    for (const [tag, data] of Object.entries(byTag)) {
      console.log(`\nTag: ${tag}`);
      console.log(`Total posts: ${data.posts.length}`);
      console.log(`Posts with images: ${data.withImages}`);
      console.log(`Posts without images: ${data.withoutImages}`);
    }
    
  } catch (error) {
    console.error('Error in checkContentImages:', error);
  }
}

checkContentImages();
