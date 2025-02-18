import { Metadata } from 'next';
import Header from '@/components/Header';
import { fetchPosts } from '../../../../lib/api';
import type { BlogPost } from '../../../types/blog';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Luxury Bathroom Remodeling | Denver Home Renovation',
  description: 'Expert tips and insights for luxury bathroom remodeling in Denver. Create your perfect spa-like retreat with our comprehensive guides.',
};

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {post.featured_image_url && (
        <div className="relative h-48 w-full">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-white hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-300 mb-4 line-clamp-2">{post.seo_description}</p>
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
  );
}

export const revalidate = 10;

export default async function BathroomRemodelingPage() {
  const allPosts = await fetchPosts();
  const bathroomPosts = allPosts.filter(post => post.title.toLowerCase().includes('bathroom'));
  const imageUrl = 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-bathroom-image-333333.jpg';

  return (
    <div>
      <Header />
      
      <div className="relative">
        {/* Category Header Image */}
        <div className="relative h-[400px] w-full">
          <Image
            src={imageUrl}
            alt="Luxury Bathroom Remodeling in Denver"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
          
          {/* Category Header Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Luxury Bathroom Remodeling
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Create your perfect spa-like retreat with our expert bathroom remodeling guides.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Latest Bathroom Articles</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover luxurious design ideas, materials, and the latest trends in bathroom renovation.
          </p>
        </div>

        {bathroomPosts.length === 0 ? (
          <div className="text-center text-gray-300">
            <p>No bathroom remodeling articles found. Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bathroomPosts.map((post: BlogPost) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
