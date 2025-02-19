import { Metadata } from 'next';
import { fetchPostsByTag } from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types/blog';
import dynamic from 'next/dynamic';

const BlogGrid = dynamic(() => import('@/components/BlogGrid'), { ssr: false });

export const metadata: Metadata = {
  title: 'Luxury Kitchen Remodeling in Denver | Modern Designs',
  description: 'Explore luxury kitchen remodeling ideas and expert tips for creating your dream kitchen in Denver. Transform your space with modern designs and premium features.',
};

export default async function KitchenPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  console.log('[KitchenPage] Fetching page:', currentPage);

  try {
    const { posts, error } = await fetchPostsByTag({
      tag: 'kitchen',
      page: currentPage,
      limit: 9,
    });

    if (error) {
      console.error('[KitchenPage] Error fetching kitchen posts:', error);
      return (
        <main className="min-h-screen bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Luxury Kitchen Remodeling
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform your kitchen into a stunning space with expert insights and inspiration.
              </p>
            </header>
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Unable to load posts. Please try again later.</p>
            </div>
          </div>
        </main>
      );
    }

    if (!Array.isArray(posts)) {
      console.error('[KitchenPage] Posts is not an array:', posts);
      throw new Error('Invalid posts data');
    }

    // Ensure all posts have image URLs and required fields
    const postsWithImages = posts.map(post => {
      if (!post || typeof post !== 'object') {
        console.error('[KitchenPage] Invalid post:', post);
        return null;
      }

      return {
        ...post,
        title: post.title || 'Untitled Post',
        description: post.description || '',
        image_url: post.image_url || 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-default-image-333333.jpg'
      };
    }).filter(Boolean) as BlogPostType[];

    // Log the content of each post to verify cleanup
    postsWithImages.forEach(post => {
      console.log(`[KitchenPage] Post "${post.title}" content length:`, post.content.length);
    });

    return (
      <main className="min-h-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Luxury Kitchen Remodeling
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your kitchen into a stunning space with expert insights and inspiration.
            </p>
          </header>

          {postsWithImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No kitchen remodeling posts available yet.</p>
            </div>
          ) : (
            <div suppressHydrationWarning>
              <BlogGrid
                posts={postsWithImages}
                currentPage={currentPage}
                totalPages={Math.ceil((postsWithImages?.length || 0) / 9)}
              />
            </div>
          )}
        </div>
      </main>
    );
  } catch (err) {
    console.error('[KitchenPage] Unexpected error:', err);
    return (
      <main className="min-h-screen bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Luxury Kitchen Remodeling
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your kitchen into a stunning space with expert insights and inspiration.
            </p>
          </header>
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">An error occurred. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }
}
