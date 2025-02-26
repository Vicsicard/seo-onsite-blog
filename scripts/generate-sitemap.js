require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function cleanUrl(url) {
  // Remove any characters that shouldn't be in URLs
  return url
    .replace(/[']/g, '') // Remove single quotes
    .replace(/[&]/g, 'and') // Replace & with 'and'
    .replace(/[?]/g, '') // Remove question marks
    .replace(/[\s]+/g, '-') // Replace spaces with hyphens
    .replace(/[–]/g, '-') // Replace en-dash with hyphen
    .replace(/[—]/g, '-') // Replace em-dash with hyphen
    .replace(/[''""]/g, '') // Remove quotes
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove any other non-alphanumeric characters
    .toLowerCase(); // Convert to lowercase
}

// Function to safely encode XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchAllPosts() {
  try {
    console.log('Fetching all posts from Supabase...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, title, created_at, tags, content')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    console.log(`Fetched ${posts.length} posts from database.`);
    return posts;
  } catch (error) {
    console.error('Exception while fetching posts:', error);
    return [];
  }
}

function getStaticPages() {
  return [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/blog/kitchen', priority: '0.9', changefreq: 'daily' },
    { url: '/blog/bathroom', priority: '0.9', changefreq: 'daily' },
    { url: '/blog/home', priority: '0.9', changefreq: 'daily' },
    { url: '/tips', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
  ];
}

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    const posts = await fetchAllPosts();
    const staticPages = getStaticPages();
    const baseUrl = 'https://luxuryhomeremodelingdenver.com';
    const currentDate = formatDate(new Date());

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemap += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
    sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    sitemap += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    // Add static pages
    console.log('Adding static pages to sitemap...');
    staticPages.forEach(({ url, priority, changefreq }) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${escapeXml(baseUrl + url)}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add dynamic blog posts
    console.log('Adding dynamic blog posts to sitemap...');
    let addedCount = 0;
    for (const post of posts) {
      // Skip posts without slugs
      if (!post.slug) {
        console.warn(`Skipping post without slug: ${post.title || 'Untitled'}`);
        continue;
      }
      
      // Clean the slug
      const cleanSlug = cleanUrl(post.slug);

      const postUrl = post.tags === 'Jerome'
        ? `/tips/${cleanSlug}/`
        : `/blog/posts/${cleanSlug}/`;

      const lastmod = post.created_at || currentDate;
      const priority = post.tags === 'Jerome' ? '0.8' : '0.7';
      const changefreq = post.tags === 'Jerome' ? 'weekly' : 'monthly';

      sitemap += `  <url>\n`;
      sitemap += `    <loc>${escapeXml(baseUrl + postUrl)}</loc>\n`;
      sitemap += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
      addedCount++;
    }

    sitemap += '</urlset>';

    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap to public directory
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    // Generate robots.txt
    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    
    console.log(`Sitemap and robots.txt generated successfully!`);
    console.log(`- Added ${staticPages.length} static pages`);
    console.log(`- Added ${addedCount} blog posts`);
    console.log(`- Sitemap saved to: ${sitemapPath}`);

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
