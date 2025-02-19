'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import BlogPostComponent from './BlogPost';
import { useState, useEffect } from 'react';

interface BlogGridProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function BlogGrid({ posts, currentPage, totalPages, onPageChange }: BlogGridProps) {
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

  if (!Array.isArray(posts)) {
    console.error('[BlogGrid] Posts is not an array:', posts);
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">Error loading posts. Please try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">No posts available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          // Verify post has required fields
          if (!post || !post.title || !post.slug) {
            console.error('[BlogGrid] Invalid post data:', post);
            return null;
          }

          return (
            <BlogPostComponent key={post.id} post={post} isPreview={true} />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange?.(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
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
