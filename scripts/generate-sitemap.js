const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || !process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY
);

const baseUrl = 'https://luxuryhomeremodelingdenver.com';

// Static pages that we know exist
const staticPages = [
  '',
  '/about',
  '/blog',
  '/blog/kitchen',
  '/blog/bathroom',
  '/blog/home',
  '/tips',
  '/privacy'
];

function cleanUrl(url) {
  // Remove leading hyphens
  url = url.replace(/^-+/, '');
  
  // Replace special characters with hyphens
  url = url.replace(/[^a-zA-Z0-9-]/g, '-');
  
  // Replace multiple consecutive hyphens with a single hyphen
  url = url.replace(/-+/g, '-');
  
  // Remove trailing hyphens
  url = url.replace(/-+$/, '');
  
  return url;
}

async function generateSitemap() {
  try {
    // Fetch all blog posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('slug, created_at');

    if (postsError) {
      throw postsError;
    }

    // Start XML string
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // Add dynamic blog post pages
    if (posts) {
      posts.forEach(post => {
        if (!post.slug) return;
        const cleanSlug = cleanUrl(post.slug);
        sitemap += `  <url>
    <loc>${baseUrl}/blog/posts/${encodeURIComponent(cleanSlug)}</loc>
    <lastmod>${new Date(post.created_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      });
    }

    // Close XML
    sitemap += `</urlset>`;

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // Write sitemap to public directory
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
