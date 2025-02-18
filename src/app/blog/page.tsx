import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { fetchPostsByTag } from '../../../lib/api';
import type { BlogPost } from '../../types/blog';

export const metadata: Metadata = {
  title: 'Blog | Denver Luxury Home Remodeling',
  description: 'Explore our collection of expert insights, tips, and trends in luxury home remodeling for Denver homeowners.',
};

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  tag: string;
}

function CategoryCard({ title, description, href, imageUrl, tag }: CategoryCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-200 text-sm mb-4">{description}</p>
          <span className="text-accent group-hover:text-accent/80 font-medium transition-colors">
            Explore Articles →
          </span>
        </div>
      </div>
    </Link>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function BlogPage() {
  const categories = [
    {
      title: "Luxury Kitchen Remodeling",
      description: "Transform your kitchen into a stunning culinary masterpiece with our expert design tips and insights.",
      href: "/blog/kitchen-remodeling",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-kitchen-image-333333333.jpg",
      tag: "kitchenremodeling"
    },
    {
      title: "Luxury Bathroom Remodeling",
      description: "Create a spa-like retreat in your home with our bathroom renovation guides and inspiration.",
      href: "/blog/bathroom-remodeling",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-bathroom-image-333333.jpg",
      tag: "bathroomremodeling"
    },
    {
      title: "Luxury Home Remodeling",
      description: "Elevate your entire living space with comprehensive home renovation expertise and trends.",
      href: "/blog/home-remodeling",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg",
      tag: "homeremodeling"
    }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg"
          alt="Luxury Home Remodeling in Denver"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your Remodeling Journey
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Explore our specialized guides and insights for different types of luxury remodeling projects.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.tag}
              {...category}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
