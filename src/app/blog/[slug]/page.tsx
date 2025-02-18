import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { fetchPostBySlug } from '../../../../lib/api';
import type { BlogPost } from '../../../types/blog';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Denver Luxury Home Remodeling',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || `Read about ${post.title} on our blog.`,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-gray-400 text-sm">
            {post.author && (
              <span className="mr-4">By {post.author}</span>
            )}
            <time dateTime={post.published_date}>
              {new Date(post.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-sm text-gray-300 bg-gray-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="text-accent hover:text-accent/80 font-medium transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
