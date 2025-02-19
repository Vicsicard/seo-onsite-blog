'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types/blog';
import { marked } from 'marked';
import BlogPostCTA from './BlogPostCTA';

interface BlogPostProps {
  post: BlogPost;
  isPreview?: boolean;
}

const renderMarkdown = (content: string) => {
  console.log('[BlogPost] Starting markdown rendering, content length:', content?.length);
  
  if (!content) {
    console.log('[BlogPost] No content to render');
    return { __html: '' };
  }

  try {
    const html = marked(content);
    console.log('[BlogPost] Markdown rendered successfully, HTML length:', html?.length);
    return { __html: html };
  } catch (error) {
    console.error('[BlogPost] Error rendering markdown:', error);
    return { __html: '<p>Error rendering content. Please try again later.</p>' };
  }
};

export default function BlogPostComponent({ post, isPreview = false }: BlogPostProps) {
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

  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    console.log('[BlogPost] Component not yet mounted');
    return null;
  }

  if (renderError) {
    console.error('[BlogPost] Render error:', renderError);
    return (
      <div className="text-center text-white p-4">
        <p>Error displaying post. Please try again later.</p>
      </div>
    );
  }

  try {
    const formattedDate = post.created_at 
      ? new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : null;

    const defaultImage = '/images/default-blog.jpg';
    const imageUrl = post.image_url || defaultImage;

    if (isPreview) {
      const postUrl = post.tags === 'Jerome' 
        ? `/tips/${post.slug}`
        : `/blog/posts/${post.slug}`;

      return (
        <Link href={postUrl} className="block">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <Image
                src={imageError ? defaultImage : imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {post.title}
              </h2>
              {formattedDate && (
                <p className="text-gray-400 text-sm mb-2">{formattedDate}</p>
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
      <article className="prose prose-invert lg:prose-xl mx-auto">
        <h1>{post.title}</h1>
        {formattedDate && (
          <p className="text-gray-400">{formattedDate}</p>
        )}
        {post.image_url && (
          <div className="relative h-[400px] my-8">
            <Image
              src={imageError ? defaultImage : imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              onError={() => setImageError(true)}
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div 
          dangerouslySetInnerHTML={renderMarkdown(post.content || '')} 
          className="mt-8"
        />
        <BlogPostCTA />
      </article>
    );
  } catch (error) {
    console.error('[BlogPost] Error in render:', error);
    setRenderError(error as Error);
    return (
      <div className="text-center text-white p-4">
        <p>Error displaying post. Please try again later.</p>
      </div>
    );
  }
}
