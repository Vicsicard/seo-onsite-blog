import { Metadata } from 'next';
import { fetchPostsByTag } from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types/blog';
import dynamic from 'next/dynamic';

const BlogGrid = dynamic(() => import('@/components/BlogGrid'), { ssr: false });

export const metadata: Metadata = {
  title: 'Luxury Bathroom Remodeling in Denver | Spa-Like Designs',
  description: 'Discover luxury bathroom remodeling ideas and expert tips for creating your perfect spa-like retreat in Denver. Transform your bathroom into a luxurious oasis.',
};

export default async function BathroomPage() {
  const { posts, error } = await fetchPostsByTag({ tag: 'bathroom' });
  
  if (error) {
    console.error('Error fetching bathroom posts:', error);
    return <div>Error loading posts</div>;
  }

  // Ensure all posts have image URLs
  const postsWithImages = posts.map(post => ({
    ...post,
    image_url: post.image_url || 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-default-image-333333.jpg'
  }));

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Luxury Bathroom Remodeling
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create your perfect spa-like retreat with expert insights and inspiration.
          </p>
        </header>

        {postsWithImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No bathroom remodeling posts available yet.</p>
          </div>
        ) : (
          <div suppressHydrationWarning>
            <BlogGrid
              posts={postsWithImages}
              currentPage={1}
              totalPages={1}
            />
          </div>
        )}
      </div>
    </main>
  );
}
