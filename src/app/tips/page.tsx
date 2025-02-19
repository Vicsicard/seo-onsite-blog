import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import { fetchPostsByTag } from '@/lib/api';
import BlogGrid from '@/components/BlogGrid';

export const metadata: Metadata = {
  title: "Jerome's Tips | Denver Luxury Home Remodeling",
  description: "Expert insights and tips from Jerome Garcia, Denver's premier luxury remodeling expert",
  openGraph: {
    title: "Jerome's Tips | Denver Luxury Home Remodeling",
    description: "Expert insights and tips from Jerome Garcia, Denver's premier luxury remodeling expert",
    url: 'https://luxuryhomeremodelingdenver.com/tips',
    siteName: 'Denver Luxury Home Remodeling',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg',
        width: 1200,
        height: 630,
        alt: "Jerome Garcia's Luxury Remodeling Tips",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function TipsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  console.log('[TipsPage] Fetching page:', currentPage);

  const { posts, error } = await fetchPostsByTag({ 
    tag: 'jerome',
    page: currentPage,
    limit: 9
  });

  if (error) {
    console.error('[TipsPage] Error fetching posts:', error);
    throw new Error('Failed to load tips posts');
  }

  // Log the content of each post to verify cleanup
  posts.forEach(post => {
    console.log(`[TipsPage] Post "${post.title}" content length:`, post.content.length);
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg"
          alt="Jerome Garcia - Denver Luxury Remodeling Expert"
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
              Today's Luxury Remodeling Tips
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Join Jerome Garcia, Denver's premier luxury remodeling expert, as he shares his latest insights and engages with readers about their home transformation projects.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogGrid
          posts={posts}
          currentPage={currentPage}
          totalPages={Math.ceil((posts?.length || 0) / 9)}
        />
      </main>
    </div>
  );
}
