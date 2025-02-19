import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import { fetchPosts } from '@/lib/api';
import BlogGrid from '@/components/BlogGrid';
import { createClient } from '@supabase/supabase-js';

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
  console.log('[TipsPage] Starting to render...');
  
  try {
    // First verify we can connect to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[TipsPage] Missing environment variables');
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Configuration Error</h1>
              <p className="text-xl">The site is currently experiencing technical difficulties. Please try again later.</p>
            </div>
          </main>
        </div>
      );
    }

    console.log('[TipsPage] Environment variables verified');

    // Test direct Supabase connection
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: testError } = await supabase
      .from('blog_posts')
      .select('count');

    if (testError) {
      console.error('[TipsPage] Database connection test failed:', testError);
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Database Connection Error</h1>
              <p className="text-xl">Unable to connect to the database. Please try again later.</p>
            </div>
          </main>
        </div>
      );
    }

    console.log('[TipsPage] Database connection successful');

    // Now proceed with the actual page data
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
    if (isNaN(currentPage) || currentPage < 1) {
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Invalid Page Number</h1>
              <p className="text-xl">The requested page number is invalid.</p>
            </div>
          </main>
        </div>
      );
    }

    console.log('[TipsPage] Fetching page:', currentPage);

    const { posts, error } = await fetchPosts('jerome', (currentPage - 1) * 9, currentPage * 9 - 1);

    if (error) {
      console.error('[TipsPage] Error fetching posts:', error);
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Error Loading Tips</h1>
              <p className="text-xl">Unable to load tips at this time. Please try again later.</p>
            </div>
          </main>
        </div>
      );
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">No Tips Available</h1>
              <p className="text-xl">Check back soon for new tips and insights!</p>
            </div>
          </main>
        </div>
      );
    }

    // Calculate total pages
    const totalPages = Math.ceil(posts.length / 9);

    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Jerome's Tips & Insights</h1>
            <p className="text-xl text-gray-300">Expert advice from Denver's premier luxury remodeling specialist</p>
          </div>
          <BlogGrid 
            posts={posts} 
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('[TipsPage] Unexpected error:', error);
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
            <p className="text-xl">An unexpected error occurred. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }
}
