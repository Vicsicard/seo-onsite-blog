import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Blog | Denver Luxury Home Remodeling',
  description: 'Explore our collection of expert insights, tips, and trends in luxury home remodeling for Denver homeowners.',
};

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl: string;
}

function CategoryCard({ title, description, href, imageUrl }: CategoryCardProps) {
  return (
    <Link href={href} className="block flex-1 group">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
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

export default function BlogPage() {
  const categories = [
    {
      title: "Luxury Kitchen Remodeling",
      description: "Transform your kitchen into a stunning culinary masterpiece with our expert design tips and insights.",
      href: "/blog/kitchen",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-kitchen-image-333333333.jpg"
    },
    {
      title: "Luxury Bathroom Remodeling",
      description: "Elevate your bathroom into a spa-like retreat with our luxury remodeling insights.",
      href: "/blog/bathroom",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-bathroom-image-333333.jpg"
    },
    {
      title: "Luxury Home Remodeling",
      description: "Discover comprehensive home transformation ideas and expert guidance for your Denver luxury home.",
      href: "/blog/home",
      imageUrl: "https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg"
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
              Expert Remodeling Insights
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover professional tips, trends, and inspiration for your next luxury remodeling project.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.href}
              {...category}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
