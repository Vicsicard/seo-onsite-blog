import { Metadata } from 'next';
import { fetchPostBySlug, fetchPosts } from '../../../../lib/api';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import Script from 'next/script';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  published_date: string;
  updated_date?: string;
  featured_image_url?: string;
  tags?: string[];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description,
      type: 'article',
      publishedTime: post.published_date,
      modifiedTime: post.updated_date,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : undefined,
    },
  };
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function JsonLd({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seo_description || "",
    "datePublished": new Date(post.published_date).toISOString(),
    "dateModified": post.updated_date 
      ? new Date(post.updated_date).toISOString()
      : new Date(post.published_date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "OnsiteProposal"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://onsiteproposal.com/blog/${post.slug}`
    },
    "image": post.featured_image_url || ""
  };

  return (
    <Script id="json-ld" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Parse markdown content to HTML
  const content = marked(post.content || '');

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd post={post} />
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex gap-4 text-gray-600 text-sm">
          <time dateTime={post.published_date}>
            Published: {new Date(post.published_date).toLocaleDateString()}
          </time>
          {post.updated_date && (
            <time dateTime={post.updated_date}>
              Updated: {new Date(post.updated_date).toLocaleDateString()}
            </time>
          )}
        </div>
        {post.tags && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-auto rounded-lg mt-6 object-cover"
          />
        )}
      </header>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
