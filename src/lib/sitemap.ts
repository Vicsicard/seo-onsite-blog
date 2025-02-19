import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    { url: '/', priority: '1.0' },
    { url: '/about', priority: '0.8' },
    { url: '/privacy', priority: '0.5' },
    { url: '/tips', priority: '0.9' },
    { url: '/blog/kitchen', priority: '0.9' },
    { url: '/blog/bathroom', priority: '0.9' },
    { url: '/blog/home', priority: '0.9' },
  ];
}

export async function generateSitemap() {
  try {
    const posts = await fetchAllPosts();
    const staticPages = getStaticPages();
    const baseUrl = 'https://luxuryhomeremodelingdenver.com';

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(({ url, priority }) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add dynamic blog posts
    posts.forEach((post) => {
      const postUrl = post.tags?.includes('jerome') 
        ? `/tips/${post.slug}`
        : `/blog/posts/${post.slug}`;

      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${postUrl}</loc>\n`;
      sitemap += `    <lastmod>${(post.updated_at || post.created_at || new Date()).slice(0, 10)}</lastmod>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += '</urlset>';

    // Write sitemap to public directory
    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}
