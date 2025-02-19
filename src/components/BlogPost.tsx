'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types/blog';
import { markdownToHtml } from '@/lib/markdown';
import { ensureAbsoluteUrl } from '@/lib/api';
import BlogPostCTA from './BlogPostCTA';

const DEFAULT_IMAGE = '/images/onsite-blog-luxury-home-image-444444.jpg';

interface BlogPostProps {
  post: BlogPost;
  isPreview?: boolean;
}

async function renderMarkdown(content: string) {
  console.log('[BlogPost] Starting markdown rendering, content length:', content?.length);
  
  if (!content) {
    console.log('[BlogPost] No content to render');
    return { __html: '' };
  }

  try {
    const html = await markdownToHtml(content);
    console.log('[BlogPost] Markdown rendered successfully, HTML length:', html?.length);
    return { __html: html };
  } catch (error) {
    console.error('[BlogPost] Error rendering markdown:', error);
    return { __html: '<p>Error rendering content. Please try again later.</p>' };
  }
}

export default function BlogPostComponent({ post, isPreview = false }: BlogPostProps) {
  const [renderedContent, setRenderedContent] = useState<{ __html: string }>({ __html: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (post?.content) {
      renderMarkdown(post.content).then(setRenderedContent);
    }
  }, [post?.content]);

  if (!post) {
    console.error('[BlogPost] No post data provided');
    return (
      <div className="text-center text-white p-4">
        <p>Error: Post data is missing</p>
      </div>
    );
  }

  console.log('[BlogPost] Rendering post:', {
    title: post.title,
    slug: post.slug,
    isPreview,
    hasContent: !!post.content,
    contentLength: post.content?.length
  });

  // Get image URL and ensure it's valid
  const rawImageUrl = post.image_url || DEFAULT_IMAGE;
  console.log('[BlogPost] Raw image URL:', rawImageUrl);
  
  const imageUrl = ensureAbsoluteUrl(rawImageUrl);
  console.log('[BlogPost] Processed image URL:', imageUrl);
  
  // Use default image if there's an error or no valid image URL
  const displayImage = imageError || !imageUrl ? DEFAULT_IMAGE : imageUrl;
  console.log('[BlogPost] Final display image:', displayImage);

  if (isPreview) {
    const postUrl = post.tags === 'Jerome' 
      ? `/tips/${post.slug}`
      : `/blog/posts/${post.slug}`;

    return (
      <Link href={postUrl} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48">
            <Image
              src={displayImage}
              alt={post.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error('[BlogPost] Image load error:', {
                  displayImage,
                  currentSrc: target.currentSrc,
                  naturalWidth: target.naturalWidth,
                  naturalHeight: target.naturalHeight,
                  error: e
                });
                setImageError(true);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {post.title}
            </h2>
            {post.created_at && (
              <p className="text-gray-400 text-sm mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
            )}
            <p className="text-gray-400 line-clamp-3">
              {post.excerpt || post.description || 'Read more about this luxury home remodeling tip.'}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="prose prose-lg prose-invert mx-auto">
      <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
        <Image
          src={displayImage}
          alt={post.title}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error('[BlogPost] Image load error:', {
              displayImage,
              currentSrc: target.currentSrc,
              naturalWidth: target.naturalWidth,
              naturalHeight: target.naturalHeight,
              error: e
            });
            setImageError(true);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      {post.excerpt && (
        <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>
      )}

      <div 
        className="prose prose-lg prose-invert max-w-none"
        dangerouslySetInnerHTML={renderedContent}
      />

      {!isPreview && <BlogPostCTA />}
    </article>
  );
}
