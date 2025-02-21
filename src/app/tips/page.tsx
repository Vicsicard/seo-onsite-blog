import { Metadata } from 'next';
import { fetchAllPosts } from '@/lib/api';
import PostList from '@/components/PostList';
import Header from '@/components/Header';
import NewsletterSignup from '@/components/NewsletterSignup';

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
