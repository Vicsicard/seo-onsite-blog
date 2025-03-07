import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import { fetchPosts } from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types/blog';

const BlogGrid = dynamic(() => import('@/components/BlogGrid'), { ssr: false });

export const metadata: Metadata = {
  title: 'Whole-Home Transformations in Denver | Luxury Remodeling',
  description: 'Explore complete home transformation ideas and expert tips for luxury remodeling in Denver. Create your dream living space with our comprehensive guides.',
};

export default async function HomePage() {
  const { posts, error } = await fetchPosts('homeremodeling', 0, 8);

  if (error) {
    console.error('Error fetching whole-home posts:', error);
    return (
      <div>
        <Header />
        <div>Error loading posts</div>
      </div>
    );
  }

  // Ensure all posts have image URLs
  const postsWithImages = posts.map(post => ({
    ...post,
    image_url: post.image_url || 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg'
  }));

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg"
          alt="Luxury Home Remodeling"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Whole-Home Transformations
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expert insights and inspiration for your complete home remodeling journey.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {postsWithImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No whole-home remodeling posts available yet.</p>
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
      </main>
    </div>
  );
}
