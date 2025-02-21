import { Metadata } from 'next';
import { fetchAllPosts } from '@/lib/api';
import PostList from '@/components/PostList';
import Header from '@/components/Header';
import NewsletterSignup from '@/components/NewsletterSignup';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Jerome's Tips | Denver Luxury Home Remodeling",
  description: "Expert tips and insights from Jerome about kitchen and bathroom remodeling in Denver's luxury homes.",
};

export default async function TipsPage() {
  try {
    const { posts, error } = await fetchAllPosts({ 
      tags: ['Jerome'],  // Only fetch posts with Jerome tag
      orderBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
      console.error('Error fetching tips:', error);
      throw error;
    }

    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        {/* Jerome's Introduction Section */}
        <section className="bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <Image
                    src="/images/onsite-blog-Jerome-image-333.jpg"
                    alt="Jerome Garcia - Luxury Home Remodeling Expert"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="w-full md:w-2/3 p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-2">Jerome Garcia - Luxury Home Remodeling Expert</h2>
                  <h3 className="text-xl mb-4">Meet Jerome Garcia</h3>
                  <p className="text-gray-300 mb-4">
                    With over 25 years of experience in luxury home remodeling, Jerome Garcia has established himself as Denver's premier renovation expert. His unique approach combines timeless design principles with cutting-edge innovations.
                  </p>
                  <p className="text-gray-300">
                    Through this blog, Jerome shares his expertise, insights, and the latest trends in luxury home remodeling to help you transform your living spaces into extraordinary environments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
          {!posts?.length ? (
            <p>No tips available at this time.</p>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in TipsPage:', error);
    throw error;
  }
}
