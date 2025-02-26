import React from 'react';
import { BlogPost } from '@/lib/types';

interface BlogJsonLdProps {
  post: BlogPost;
  url: string;
}

/**
 * Renders JSON-LD structured data for blog posts
 * This helps search engines better understand and display your content
 */
export default function BlogJsonLd({ post, url }: BlogJsonLdProps) {
  if (!post) return null;
  
  const baseUrl = 'https://luxuryhomeremodelingdenver.com';
  const fullUrl = `${baseUrl}${url}`;
  const imageUrl = post.image_url ? 
    (post.image_url.startsWith('http') ? post.image_url : `${baseUrl}${post.image_url}`) : 
    `${baseUrl}/images/onsite-blog-luxury-home-image-444444.jpg`;
  
  const authorName = post.tags === 'Jerome' ? 'Jerome Anderson' : 'Onsite Proposal Team';
  
  // Format dates for proper ISO format
  const datePublished = post.published_at ? new Date(post.published_at).toISOString() : '';
  const dateModified = post.updated_at ? new Date(post.updated_at).toISOString() : datePublished;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Onsite Proposal',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    description: post.description || post.excerpt || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    url: fullUrl
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
