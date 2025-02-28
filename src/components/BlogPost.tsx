'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { BlogPost, ImageItem } from '@/types/blog';
import { markdownToHtml } from '@/lib/markdown';
import { ensureAbsoluteUrl, getNormalizedImages } from '@/lib/api';
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
  const [displayImage, setDisplayImage] = useState('');
  const [allImages, setAllImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (post?.content) {
      renderMarkdown(post.content).then(setRenderedContent);
    }
  }, [post?.content]);

  // Process images on component mount or when post changes
  useEffect(() => {
    if (post) {
      const { mainImage, allImages } = getNormalizedImages(post);
      setDisplayImage(mainImage || DEFAULT_IMAGE);
      setAllImages(allImages);
      console.log('[BlogPost] Normalized images:', { 
        mainImage, 
        imageCount: allImages.length 
      });
    }
  }, [post]);

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
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.error('[BlogPost] Image load error:', {
      attemptedImage: displayImage,
      currentSrc: target.currentSrc,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      error: e
    });
    
    // Try to apply default image based on tags
    let defaultImage = DEFAULT_IMAGE;
    
    if (post.tags === 'Jerome') {
      defaultImage = '/images/onsite-blog-Jerome-image-333.jpg';
    } else if (post.tags?.toLowerCase().includes('kitchen')) {
      defaultImage = '/images/onsite-blog-kitchen-image-333333333.jpg';
    } else if (post.tags?.toLowerCase().includes('bathroom')) {
      defaultImage = '/images/onsite-blog-bathroom-image-333333.jpg';
    }
    
    console.log('[BlogPost] Applied fallback image:', defaultImage);
    setDisplayImage(defaultImage);
    setImageError(true);
  };

  if (isPreview) {
    const postUrl = post.tags === 'Jerome' 
      ? `/tips/${post.slug}`
      : `/blog/posts/${post.slug}`;

    return (
      <Link href={postUrl} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-60 w-full">
            {/* Always use a standard HTML img tag to avoid Next.js Image component issues */}
            <img
              src={displayImage}
              alt={allImages[0]?.alt || post.title}
              className="object-cover h-full w-full"
              onError={handleImageError}
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
    <article className="max-w-3xl mx-auto text-white">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        {post.created_at && (
          <p className="text-gray-400 mb-2">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </header>

      <div className="mb-8 rounded-lg overflow-hidden">
        {/* Main featured image */}
        <img
          src={displayImage}
          alt={allImages[0]?.alt || post.title}
          className="object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Multiple images gallery - only show if there are more than one image */}
      {allImages.length > 1 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((image, index) => (
              <div key={`image-${index}`} className="rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="object-cover w-full h-48"
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-invert max-w-none mb-8" dangerouslySetInnerHTML={renderedContent} />

      <BlogPostCTA />
    </article>
  );
}
