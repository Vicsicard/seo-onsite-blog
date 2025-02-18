import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'About | Denver Luxury Home Remodeling',
  description: 'Learn about our mission to provide expert insights and guidance for luxury home remodeling in Denver.',
};

export default function AboutPage() {
  return (
    <div>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">About Us</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            Content coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
