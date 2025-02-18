import { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Denver Luxury Home Remodeling Blog | Expert Tips & Insights',
  description: 'Get daily luxury remodeling tips from Jerome Garcia, Denver\'s premier home renovation expert with 25+ years of experience. Transform your home with expert guidance.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Today's Luxury Remodeling Tips</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join Jerome Garcia, Denver's premier luxury remodeling expert, as he shares his latest insights 
            and engages with readers about their home transformation projects.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Blog posts will be added here */}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Explore All Articles
          </Link>
        </div>
      </section>
    </main>
  );
}
