'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { truncateText } from '@/types/blog';
import { useState, useEffect } from 'react';

interface BlogGridProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-default-image-333333.jpg';

export default function BlogGrid({ posts, currentPage, totalPages, onPageChange }: BlogGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleImageError = (postId: string, imageUrl: string) => {
    console.log(`[BlogGrid] Image error for post ${postId}:`, imageUrl);
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  if (!Array.isArray(posts)) {
    console.error('[BlogGrid] Posts is not an array:', posts);
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">Error loading posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          if (!post || typeof post !== 'object') {
            console.error('[BlogGrid] Invalid post:', post);
            return null;
          }

          const imageUrl = post.image_url || DEFAULT_IMAGE;
          console.log(`[BlogGrid] Post "${post.title}" image URL:`, imageUrl);
          
          return (
            <article key={post.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href={`/blog/posts/${post.slug}`} className="block">
                <div className="relative aspect-video">
                  {!imageErrors[post.id] ? (
                    <Image
                      src={imageUrl}
                      alt={post.title || 'Blog post'}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(post.id, imageUrl)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={currentPage === 1}
                    />
                  ) : (
                    <Image
                      src={DEFAULT_IMAGE}
                      alt={post.title || 'Blog post'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={currentPage === 1}
                    />
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {post.title || 'Untitled Post'}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {truncateText(post.description || '', 150)}
                  </p>
                  <span className="text-accent font-medium">Read More →</span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange?.(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
