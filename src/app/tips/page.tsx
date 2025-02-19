import { Metadata } from 'next';
import { fetchAllPosts } from '@/lib/api';
import PostList from '@/components/PostList';
import Header from '@/components/Header';

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

    if (!posts?.length) {
      console.log('No tips found');
      return (
        <main className="min-h-screen bg-gray-900 text-white">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
            <p>No tips available at this time.</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Jerome's Tips</h1>
          <PostList posts={posts} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in TipsPage:', error);
    throw error;
  }
}
