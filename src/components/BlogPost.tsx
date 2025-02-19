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
  
  try {
    const html = marked(content || '');
    console.log('[BlogPost] Markdown rendered successfully, HTML length:', html?.length);
    return { __html: html };
  } catch (error) {
    console.error('[BlogPost] Error rendering markdown:', error);
    return { __html: content || '' };
  }
};

export default function BlogPostComponent({ post, isPreview = false }: BlogPostProps) {
  console.log('[BlogPost] Rendering post:', {
    title: post?.title,
    slug: post?.slug,
    isPreview,
    hasContent: !!post?.content,
    contentLength: post?.content?.length
  });

  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    console.log('[BlogPost] Component not yet mounted');
    return null;
  }

  const formattedDate = post?.created_at 
    ? new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Additional cleanup for any remaining CTA text
  const cleanupContent = (content: string) => {
    console.log('[BlogPost] Cleaning content, initial length:', content?.length);
    
    if (!content) {
      console.log('[BlogPost] No content to clean');
      return '';
    }
    
    // Remove CTA text
    let cleanContent = content.replace(/Looking for Home Remodelers in Denver\?[\s\S]*?(?:contractors across all trades\.|info@topcontractorsdenver\.com)/g, '').trim();
    
    // Remove any HTML comments
    cleanContent = cleanContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove excessive newlines
    cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');
    
    console.log('[BlogPost] Content cleaned, final length:', cleanContent?.length);
    return cleanContent;
  };

  if (!post) {
    console.error('[BlogPost] No post data provided');
    return (
      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6">
        <p className="text-red-400">Error loading post data</p>
      </div>
    );
  }

  if (!post.content) {
    console.error('[BlogPost] Post has no content:', post.slug);
    return (
      <div className="bg-yellow-500/10 backdrop-blur-sm rounded-lg p-6">
        <p className="text-yellow-400">This post has no content</p>
      </div>
    );
  }

  const renderContent = () => {
    console.log('[BlogPost] Starting content render');
    
    if (isPreview) {
      return (
        <Link href={post.tags?.includes('jerome') ? `/tips/${post.slug}` : `/blog/posts/${post.slug}`} className="block">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">{post.title}</h2>
            {formattedDate && (
              <p className="text-gray-400 text-sm mb-4">{formattedDate}</p>
            )}
            <p className="text-gray-300">{post.excerpt || post.description}</p>
          </div>
        </Link>
      );
    }

    const cleanedContent = cleanupContent(post.content);
    console.log('[BlogPost] Content processing:', {
      originalLength: post.content?.length,
      cleanedLength: cleanedContent?.length,
      firstChars: cleanedContent?.substring(0, 100)
    });

    return (
      <div className="p-6 pt-12">
        <h1 className="text-4xl font-bold text-gray-200 mb-4">{post.title}</h1>
        {formattedDate && (
          <p className="text-gray-400 text-sm mb-8">{formattedDate}</p>
        )}
        <div 
          className="prose prose-invert lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={renderMarkdown(cleanedContent)}
        />
        {!isPreview && <BlogPostCTA />}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-full aspect-video">
        <Image
          src={post.image_url || '/images/default-blog.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority={!isPreview}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-blog.jpg';
          }}
        />
      </div>
      {renderContent()}
    </div>
  );
}
