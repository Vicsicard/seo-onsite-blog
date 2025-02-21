'use client';

import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        
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
                  src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-home-default-image-333333.jpg"
                  alt="Whole-Home Transformations"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">Whole-Home Transformations</h3>
                  <p className="text-gray-200 mt-2">Complete luxury home remodeling solutions</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Stay Updated with Jerome
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Subscribe to receive expert tips and insights about luxury home remodeling.
            </p>
            <NewsletterSignup />
          </div>
        </section>
      </main>
    </div>
  );
}
