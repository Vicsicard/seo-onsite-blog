'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types/blog';

interface BlogPostProps {
  post: BlogPost;
  isPreview?: boolean;
}

export default function BlogPostComponent({ post, isPreview = false }: BlogPostProps) {
  const [imageError, setImageError] = useState(false);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    if (!post) {
      console.error('[BlogPost] No post data provided');
      return;
    }
    console.log(`[BlogPost] Rendering post: ${post.title}`);
  }, [post]);

  const formattedDate = post.created_at 
    ? new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  if (!post) {
    console.error('[BlogPost] Rendering error state - no post data');
    return (
      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6">
        <p className="text-red-400">Error loading post data</p>
      </div>
    );
  }

  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {post.image_url && !imageError && (
        <div className="relative h-64 w-full bg-gray-800">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.error('[BlogPost] Image loading error for:', post.title);
              console.error('[BlogPost] Failed image URL:', post.image_url);
              setImageError(true);
            }}
            priority={true}
          />
        </div>
      )}
      
      <div className="p-6">
        {isPreview ? (
          <h2 className="text-2xl font-bold text-white mb-4">
            <Link
              href={`/blog/posts/${post.slug}`}
              className="text-gray-200 hover:text-white transition-colors duration-200"
            >
              {post.title}
            </Link>
          </h2>
        ) : (
          <h1 className="text-3xl font-bold text-gray-200 mb-4">{post.title}</h1>
        )}

        {contentError ? (
          <div className="text-red-400 mb-4">
            Error loading content. Please try refreshing the page.
          </div>
        ) : (
          <div className="text-gray-300 mb-4">
            {isPreview ? (
              <p>{post.content.substring(0, 200)}...</p>
            ) : (
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <time className="text-sm text-gray-400" dateTime={post.created_at || ''}>
            {formattedDate}
          </time>
          
          {isPreview && (
            <Link
              href={`/blog/posts/${post.slug}`}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Read More →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
