const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY
);

async function fetchAllPosts() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at, tags')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return posts;
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
    const posts = await fetchAllPosts();
    const staticPages = getStaticPages();
    const baseUrl = 'https://luxuryhomeremodelingdenver.com';

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemap += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
    sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    sitemap += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    // Add static pages
    staticPages.forEach(({ url, priority, changefreq }) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${url}</loc>\n`;
      sitemap += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add dynamic blog posts
    posts.forEach((post) => {
      const postUrl = post.tags === 'Jerome'
        ? `/tips/${post.slug}`
        : `/blog/posts/${post.slug}`;

      const lastmod = post.updated_at || post.created_at || new Date();
      const priority = post.tags === 'Jerome' ? '0.8' : '0.7';
      const changefreq = post.tags === 'Jerome' ? 'weekly' : 'monthly';

      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${postUrl}</loc>\n`;
      sitemap += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += '</urlset>';

    // Write sitemap to public directory
    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    
    // Generate robots.txt
    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    
    console.log('Sitemap and robots.txt generated successfully!');

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

module.exports = {
  generateSitemap
};
