import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: 'Luxury Home Remodeling in Denver – Trends, Tips & Inspiration',
  description: 'Get daily luxury remodeling tips from Jerome Garcia, Denver\'s premier home renovation expert with 25+ years of experience. Transform your home with expert guidance.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
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

          {/* Whole Home Category */}
          <Link href="/blog/home" className="group">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg"
                alt="Whole Home Transformations"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">Whole Home Transformations</h3>
                <p className="text-gray-200 mt-2">Complete luxury home renovations</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Expert Profile Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 relative w-full md:w-96 h-64 md:h-auto">
              <Image
                src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-Jerome-image-333.jpg"
                alt="Jerome Garcia"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Meet Jerome Garcia</h2>
              <p className="text-gray-300 mb-6">
                With over 25 years of experience in luxury home remodeling, Jerome brings unparalleled expertise to every project. His innovative designs and attention to detail have made him Denver's go-to expert for high-end home transformations.
              </p>
              <Link
                href="/tips"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Read Expert Tips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
