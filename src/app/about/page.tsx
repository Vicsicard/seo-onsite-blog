import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'About Us | Denver Luxury Home Remodeling',
  description: 'Learn about our commitment to excellence in luxury home remodeling in Denver. Meet Jerome Garcia and discover our approach to transforming homes.',
  openGraph: {
    title: 'About Us | Denver Luxury Home Remodeling',
    description: 'Learn about our commitment to excellence in luxury home remodeling in Denver. Meet Jerome Garcia and discover our approach to transforming homes.',
    url: 'https://luxuryhomeremodelingdenver.com/about',
    siteName: 'Denver Luxury Home Remodeling',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg',
        width: 1200,
        height: 630,
        alt: 'Denver Luxury Home Remodeling Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg"
          alt="Denver Luxury Home Remodeling Team"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Transforming Denver homes with luxury craftsmanship and unparalleled attention to detail
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert lg:prose-xl max-w-none">
          <h2>Our Story</h2>
          <p>
            At Denver Luxury Home Remodeling, we believe that your home should be a perfect reflection of your lifestyle and aspirations. Led by Jerome Garcia, our team brings together decades of experience in luxury home transformations, creating spaces that inspire and delight.
          </p>

          <h2>Our Approach</h2>
          <p>
            We take pride in our meticulous attention to detail and our commitment to using only the finest materials and craftsmanship. Every project begins with a thorough understanding of your vision, followed by detailed planning and expert execution.
          </p>

          <h2>Meet Jerome Garcia</h2>
          <p>
            With over two decades of experience in luxury home remodeling, Jerome Garcia has established himself as Denver's premier remodeling expert. His innovative designs and commitment to excellence have transformed countless homes across the Denver metro area.
          </p>

          <h2>Our Commitment</h2>
          <p>
            We are dedicated to delivering exceptional results that exceed your expectations. From initial consultation to final walkthrough, we ensure clear communication, precise execution, and outstanding craftsmanship in every project.
          </p>
        </div>
      </main>
    </div>
  );
}
