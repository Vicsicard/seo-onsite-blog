import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPosts } from '../../lib/api';
import type { BlogPost } from '../types/blog';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Denver Luxury Home Remodeling Blog | Expert Tips & Insights',
  description: 'Explore expert insights, contractor recommendations, and remodeling tips for Denver homeowners. Your trusted source for luxury home renovation guidance.',
};

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
        <p className="text-gray-300 mb-4 line-clamp-2">{post.seo_description}</p>
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

export const revalidate = 10;

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main>
      <Hero />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Latest Remodeling Insights</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the latest trends, expert tips, and practical advice for your Denver home remodeling projects.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-300">
            <p>No posts found. Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BlogPost) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
