import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPostsByTag } from '../../lib/api';
import type { BlogPost } from '../types/blog';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Denver Luxury Home Remodeling Blog | Expert Tips & Insights',
  description: 'Get daily luxury remodeling tips from Jerome Garcia, Denver\'s premier home renovation expert with 25+ years of experience. Join the conversation about high-end home transformations.',
};

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {post.featured_image_url && (
        <div className="relative h-48 w-full">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-white hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt || post.seo_description}</p>
        <div className="flex justify-between items-center">
          <time className="text-sm text-gray-400" dateTime={post.published_date}>
            {new Date(post.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <Link
            href={`/blog/${post.slug}`}
            className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}

function JeromeTipCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex items-start p-6">
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-xl font-bold">
            JG
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold text-white">Jerome Garcia</h2>
            <span className="ml-2 text-sm text-gray-400">Luxury Remodeling Expert</span>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            25+ years of transforming Denver homes into luxury living spaces
          </p>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <h3 className="text-2xl font-bold mb-4">
          <Link href={`/blog/${post.slug}`} className="text-white hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-300 mb-6 line-clamp-3">{post.excerpt || post.seo_description}</p>
        
        <div className="flex items-center justify-between">
          <time className="text-sm text-gray-400" dateTime={post.published_date}>
            {new Date(post.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <Link
            href={`/blog/${post.slug}#conversation`}
            className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Join the Conversation →
          </Link>
        </div>
      </div>
    </article>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function Home() {
  let jeromePosts: BlogPost[] = [];
  let posts: BlogPost[] = [];
  try {
    const jeromeResult = await fetchPostsByTag({ tag: 'jerome', page: 1, limit: 1 });
    jeromePosts = jeromeResult.posts;
    const result = await fetchPostsByTag({ tag: 'homeremodeling', page: 1, limit: 3 });
    posts = result.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <main>
      <Hero />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Today's Luxury Remodeling Tips</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join Jerome Garcia, Denver's premier luxury remodeling expert, as he shares his latest insights and engages with readers about their home transformation projects.
          </p>
        </div>

        {jeromePosts.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <JeromeTipCard post={jeromePosts[0]} />
          </div>
        ) : (
          <div className="text-center text-gray-300 py-12">
            <p>Check back soon for Jerome's latest remodeling tips!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            View All Expert Tips
          </Link>
        </div>

        {/* Latest Posts Section */}
        {posts.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Latest Articles</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover our most recent insights and expert advice for your remodeling projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
              >
                View All Articles
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
