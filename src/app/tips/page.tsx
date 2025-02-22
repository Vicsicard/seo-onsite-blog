import { Metadata } from 'next';
import { fetchAllPosts } from '@/lib/api';
import PostList from '@/components/PostList';
import Header from '@/components/Header';
import NewsletterSignup from '@/components/NewsletterSignup';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jerome's Tips | Denver Luxury Home Remodeling",
  description: "Expert tips and insights from Jerome about kitchen and bathroom remodeling in Denver's luxury homes.",
};

export default async function TipsPage() {
  console.log('[TipsPage] Starting to fetch tips...');

  try {
    const { posts, error } = await fetchAllPosts({ 
      tags: 'Jerome',
      orderBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
      console.error('[TipsPage] Error fetching tips:', error);
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="max-w-7xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
            <p className="text-red-500">Error loading tips. Please try again later.</p>
          </main>
        </div>
      );
    }

    if (!posts?.length) {
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="max-w-7xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
            <p>No tips available at the moment. Check back soon!</p>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        {/* Meet Jerome Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/onsite-blog-Jerome-image-333.jpg"
                alt="Jerome Garcia - Luxury Home Remodeling Expert"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Meet Jerome Garcia</h2>
              <p className="text-gray-300 text-lg mb-6">
                With over 25 years of experience in luxury home remodeling, Jerome Garcia has established himself as Denver's premier renovation expert. His unique approach combines timeless design principles with cutting-edge innovations.
              </p>
              <p className="text-gray-300 text-lg mb-8">
                Through this blog, Jerome shares his expertise, insights, and the latest trends in luxury home remodeling to help you transform your living spaces into extraordinary environments.
              </p>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
          <PostList posts={posts} />
        </div>

        {/* Newsletter Section */}
        <section className="bg-gray-900 py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Stay Updated with Expert Tips</h2>
                <p className="text-gray-300 text-sm mb-4 text-center px-2">
                  Subscribe to receive the latest insights about luxury home remodeling in Denver.
                </p>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('[TipsPage] Unexpected error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="max-w-7xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
          <p className="text-red-500">An unexpected error occurred. Please try again later.</p>
        </main>
      </div>
    );
  }
}
