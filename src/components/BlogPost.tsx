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

  // Extract the first image from the HTML content
  const getFirstImage = (content: string): string | null => {
    try {
      console.log('[BlogPost] Extracting first image from content');
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      if (!imgMatch) {
        console.log('[BlogPost] No image found in content');
        return null;
      }
      
      // Validate URL
      try {
        const url = new URL(imgMatch[1]);
        console.log('[BlogPost] Successfully extracted image URL:', url.toString());
        return url.toString();
      } catch (err) {
        console.error('[BlogPost] Invalid image URL:', err);
        return null;
      }
    } catch (err) {
      console.error('[BlogPost] Error extracting image:', err);
      return null;
    }
  };

  // Remove the first image from the content if we're displaying it separately
  const cleanContent = (content: string): string => {
    try {
      console.log('[BlogPost] Cleaning content');
      const cleaned = content.replace(/<p><img[^>]+><\/p>/, '').trim();
      console.log('[BlogPost] Content cleaned successfully');
      return cleaned;
    } catch (err) {
      console.error('[BlogPost] Error cleaning content:', err);
      setContentError(true);
      return content;
    }
  };

  const imageUrl = post.content ? getFirstImage(post.content) : null;
  const cleanedContent = post.content ? cleanContent(post.content) : '';

  // For preview, create a short excerpt
  const createExcerpt = (content: string): string => {
    try {
      console.log('[BlogPost] Creating excerpt');
      // Remove HTML tags and get plain text
      const plainText = content.replace(/<[^>]+>/g, '');
      const excerpt = plainText.substring(0, 200) + '...';
      console.log('[BlogPost] Excerpt created successfully');
      return excerpt;
    } catch (err) {
      console.error('[BlogPost] Error creating excerpt:', err);
      return 'Preview not available';
    }
  };

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
      {imageUrl && !imageError && (
        <div className="relative h-64 w-full bg-gray-800">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.error('[BlogPost] Image loading error:', e);
              setImageError(true);
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isPreview ? (
            <Link
              href={`/blog/posts/${post.slug}`}
              className="text-2xl font-bold text-gray-200 hover:text-white transition-colors duration-200"
            >
              {post.title}
            </Link>
          ) : (
            <h1 className="text-3xl font-bold text-gray-200">{post.title}</h1>
          )}
        </h2>

        {contentError ? (
          <div className="text-red-400 mb-4">
            Error loading content. Please try refreshing the page.
          </div>
        ) : (
          <div className="text-gray-300 mb-4">
            {isPreview ? (
              <p>{createExcerpt(cleanedContent)}</p>
            ) : (
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanedContent }} 
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <time className="text-sm text-gray-400" dateTime={post.created_at || ''}>
            {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Date not available'}
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
