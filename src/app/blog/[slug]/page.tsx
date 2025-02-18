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

function JeromeProfile() {
  return (
    <div className="flex items-start space-x-4 mb-8">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold">
          JG
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">Jerome Garcia</h3>
        <p className="text-gray-400">Luxury Remodeling Expert</p>
        <p className="text-gray-300 mt-2">
          With over 25 years of experience transforming Denver homes into luxury living spaces, 
          Jerome specializes in high-end renovations and loves sharing his expertise with homeowners.
        </p>
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const isJeromePost = post.tags?.includes('jerome');

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
          {isJeromePost && <JeromeProfile />}
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-gray-400 text-sm">
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

        {/* Jerome's Conversation Section */}
        {isJeromePost && (
          <section id="conversation" className="mt-16 pt-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-6">Join the Conversation</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-gray-300 mb-6">
                Have questions about today's tips? Want to share your own remodeling experience? 
                I'd love to hear from you! Leave your comments or questions below, and I'll personally 
                respond to help guide you through your luxury home transformation journey.
              </p>
              <div className="text-center">
                <Link
                  href="#" // You'll need to implement the actual comment system
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
                >
                  Start a Discussion with Jerome
                </Link>
              </div>
            </div>
          </section>
        )}

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
