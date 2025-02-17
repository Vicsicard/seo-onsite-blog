import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPosts } from '../../lib/api';
import type { BlogPost } from '../types/blog';

export const metadata: Metadata = {
  title: 'My Supabase Blog',
  description: 'A blog about luxury home remodeling and more.',
};

// Optional: Create a reusable component for each post
function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold mb-2">
        <Link href={`/blog/${post.slug}`} className="text-white hover:text-accent">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-300 mb-4">{post.seo_description}</p>
      <p className="text-sm text-gray-400">
        Published on: {new Date(post.published_date).toLocaleDateString()}
      </p>
    </article>
  );
}

export const revalidate = 10; // Revalidate every 10 seconds

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-300">No posts found.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post: BlogPost) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
