import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import BlogPost from '@/components/BlogPost';
import { fetchPostsByTag } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Luxury Home Remodeling | Denver Luxury Home Remodeling',
  description: 'Discover comprehensive home transformation ideas and expert guidance for your Denver luxury home.',
};

export default async function HomePage() {
  const { posts } = await fetchPostsByTag({ 
    tag: 'homeremodeling',
    page: 1,
    limit: 9
  });

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
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Luxury Home Remodeling
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Discover comprehensive home transformation ideas and expert guidance for your Denver luxury home.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-gray-200">
            <p>No posts available yet. Check back soon for more content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPost key={post.id} post={post} isPreview={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
