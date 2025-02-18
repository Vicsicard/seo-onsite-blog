import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

export const metadata: Metadata = {
  title: 'Luxury Home Remodeling in Denver – Trends, Tips & Inspiration',
  description: 'Get daily luxury remodeling tips from Jerome Garcia, Denver\'s premier home renovation expert with 25+ years of experience. Transform your home with expert guidance.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      
      {/* Featured Blog Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Explore Luxury Home Remodeling Trends & Insights
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Discover expert strategies, high-end design ideas, and innovative remodeling trends to elevate your Denver home.
        </p>
        <FeaturedPosts />
      </section>

      {/* Remodeling Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kitchen Category */}
          <Link href="/blog/kitchen" className="group">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-kitchen-image-333333333.jpg"
                alt="Luxury Kitchen Remodeling"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">Luxury Kitchen Remodeling</h3>
                <p className="text-gray-200 mt-2">Transform your kitchen into a culinary masterpiece</p>
              </div>
            </div>
          </Link>

          {/* Bathroom Category */}
          <Link href="/blog/bathroom" className="group">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-bathroom-image-333333.jpg"
                alt="Luxury Bathroom Remodeling"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">Luxury Bathroom Remodeling</h3>
                <p className="text-gray-200 mt-2">Create your perfect spa-like retreat</p>
              </div>
            </div>
          </Link>

          {/* Home Category */}
          <Link href="/blog/home" className="group">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg"
                alt="Whole-Home Transformations"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">Whole-Home Transformations</h3>
                <p className="text-gray-200 mt-2">Elevate your entire living space</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Jerome's Profile Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Meet Jerome – Your Guide to Luxury Home Transformations
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-Jerome-image-333.jpg"
              alt="Jerome Garcia - Luxury Home Remodeling Expert"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-300 text-lg mb-6">
              With over 25 years of experience in luxury home remodeling, Jerome Garcia brings unparalleled expertise 
              to Denver's high-end residential projects. His innovative approach combines timeless design principles 
              with cutting-edge trends, ensuring each renovation exceeds expectations.
            </p>
            <Link
              href="/tips"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Read Jerome's Expert Tips
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
