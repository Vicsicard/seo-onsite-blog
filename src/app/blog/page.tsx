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
            View Articles →
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

  // Get latest posts from each category
  const categoryPosts = await Promise.all(
    categories.map(async (category) => {
      try {
        const result = await fetchPostsByTag({
          tag: category.tag as any,
          page: 1,
          limit: 1
        });
        return result.posts[0];
      } catch (error) {
        console.error(`Error fetching posts for ${category.tag}:`, error);
        return null;
      }
    })
  );

  const latestPosts = categoryPosts.filter((post): post is BlogPost => post !== null);

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Remodeling Categories</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our specialized guides and insights for different types of luxury remodeling projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => (
            <CategoryCard
              key={category.tag}
              {...category}
            />
          ))}
        </div>

        {latestPosts.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Latest Articles</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover our most recent insights across all categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <article key={post.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {post.featured_image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {post.excerpt || post.seo_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <time className="text-sm text-gray-400" dateTime={post.published_date}>
                        {new Date(post.published_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
