import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { fetchPostsByTag } from '../../../../lib/api';
import type { BlogPost } from '../../../types/blog';

export const metadata: Metadata = {
  title: 'Luxury Home Remodeling | Denver Home Renovation',
  description: 'Expert tips and insights for luxury home remodeling in Denver. Transform your entire living space with comprehensive renovation expertise.',
};

interface BlogCardProps {
  post: BlogPost;
}

function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
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
        <h2 className="text-xl font-bold mb-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-white hover:text-accent transition-colors"
          >
            {post.title}
          </Link>
        </h2>
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
  );
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center space-x-2 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === page
              ? 'bg-accent text-white'
              : 'text-white bg-white/10 hover:bg-white/20'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default async function HomeRemodelingPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { posts, totalPages } = await fetchPostsByTag({
    tag: 'homeremodeling',
    page: currentPage
  });

  const imageUrl = 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg';

  return (
    <div>
      <Header />
      
      <div className="relative">
        {/* Category Header Image */}
        <div className="relative h-[400px] w-full">
          <Image
            src={imageUrl}
            alt="Luxury Home Remodeling in Denver - Complete home transformation"
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
                Luxury Home Remodeling
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Transform your entire living space with our comprehensive home remodeling expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-gray-300">
            <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
            <p>Check back soon for new home remodeling content!</p>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  window.location.href = `/blog/home-remodeling?page=${page}`;
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
