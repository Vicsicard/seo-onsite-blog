import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPosts } from '../../lib/api';

export const metadata: Metadata = {
  title: 'My Supabase Blog',
  description: 'A blog about luxury home remodeling and more.',
};

// Optional: Create a reusable component for each post
function PostCard({ post }: { post: any }) {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold mb-2">
        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 mb-4">{post.seo_description}</p>
      <p className="text-sm text-gray-500">
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
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts found.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post: any) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
