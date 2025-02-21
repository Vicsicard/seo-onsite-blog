'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kitchen Category */}
            <Link href="/blog/kitchen" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/images/onsite-blog-kitchen-image-333333333.jpg"
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
                  src="/images/onsite-blog-bathroom-image-333333.jpg"
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
                  src="/images/onsite-blog-luxury-home-image-444444.jpg"
                  alt="Luxury Home Remodeling"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white">Luxury Home Remodeling</h3>
                  <p className="text-gray-200 mt-2">Elevate your entire living space</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Meet Jerome Section with Newsletter */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/onsite-blog-Jerome-image-333.jpg"
                alt="Jerome Garcia - Luxury Home Remodeling Expert"
                fill
                className="object-cover"
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
              <Link
                href="/tips"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Learn More About Jerome
              </Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Stay Updated with Jerome
            </h3>
            <p className="text-gray-300 text-center mb-6">
              Subscribe to receive expert tips and insights about luxury home remodeling.
            </p>
            <NewsletterSignup />
          </div>
        </section>
      </main>
    </div>
  );
}
