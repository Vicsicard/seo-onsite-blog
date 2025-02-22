'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types';
import { marked } from 'marked';

const DEFAULT_IMAGE = '/images/onsite-blog-luxury-home-image-444444.jpg';

interface BlogPostProps {
  post: BlogPost;
  isPreview?: boolean;
}

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return DEFAULT_IMAGE;
  
  // If it's already a relative path starting with /, use it
  if (url.startsWith('/')) return url;
  
  // If it starts with //, add https:
  if (url.startsWith('//')) return `https:${url}`;

  // Handle GitHub raw content URLs
  if (url.includes('raw.githubusercontent.com')) {
    return url;
  }
  
  try {
    // Try to create a URL object to validate
    const urlObj = new URL(url);
    // If it's a valid URL with http/https protocol, use it
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return url;
    }
    // Otherwise fall back to default
    return DEFAULT_IMAGE;
  } catch (e) {
    console.warn('Invalid image URL:', url);
    return DEFAULT_IMAGE;
  }
};

function formatContent(content: string): string {
  if (!content) return '';

  // Process markdown content
  let processedContent = marked.parse(content, {
    gfm: true,
    breaks: true,
    renderer: Object.assign(new marked.Renderer(), {
      // Enhanced heading rendering with proper spacing and styling
      heading(text, level) {
        if (level === 1) {
          return `
            <h1 class="text-4xl font-bold text-white mb-8 mt-12">
              ${text}
            </h1>
          `;
        }
        // For section headings (h2)
        if (level === 2) {
          return `
            <h2 class="text-2xl font-bold text-white mb-6 mt-12">
              ${text}
            </h2>
          `;
        }
        // For subsection headings (h3)
        return `
          <h3 class="text-xl font-bold text-white mb-4 mt-8">
            ${text}
          </h3>
        `;
      },
      // Enhanced paragraph rendering
      paragraph(text) {
        if (text.includes('<figure') || text.includes('<blockquote')) return text;
        
        // Handle key takeaways section
        if (text.startsWith('Key Takeaways')) {
          const items = text.split('\n').filter(Boolean);
          return `
            <div class="bg-gray-800/50 p-6 rounded-lg my-8 border border-gray-700/50">
              <h2 class="text-2xl font-bold text-white mb-4">Key Takeaways</h2>
              <ul class="space-y-2">
                ${items.slice(1).map(item => `
                  <li class="flex items-start gap-2">
                    <span class="text-accent mt-1.5">•</span>
                    <span class="text-gray-300">${item.trim()}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `;
        }
        
        return `<p class="text-gray-300 leading-relaxed mb-6">${text}</p>`;
      },
      // Enhanced blockquote rendering
      blockquote(quote) {
        return `
          <figure class="my-12">
            <blockquote class="relative pl-6 italic text-lg text-gray-300">
              <span class="absolute left-0 top-0 text-4xl text-accent">"</span>
              ${quote}
              <span class="text-4xl text-accent">"</span>
            </blockquote>
          </figure>
        `;
      },
      // Enhanced list rendering
      list(body, ordered) {
        const type = ordered ? 'ol' : 'ul';
        const listClass = ordered 
          ? 'list-decimal pl-6 space-y-2' 
          : 'list-none space-y-2';
        return `
          <${type} class="${listClass} mb-6">
            ${body}
          </${type}>
        `;
      },
      // Enhanced list item rendering
      listitem(text) {
        if (!text.includes('✓')) {
          return `
            <li class="flex items-start gap-2">
              <span class="text-accent mt-1.5">•</span>
              <span class="text-gray-300">${text}</span>
            </li>
          `;
        }
        return `
          <li class="flex items-start gap-2">
            <span class="text-green-500">✓</span>
            <span class="text-gray-300">${text.replace('✓', '')}</span>
          </li>
        `;
      },
      // Enhanced image rendering
      image(href, title, text) {
        const validUrl = getImageUrl(href);
        return `
          <figure class="my-12">
            <img 
              src="${validUrl}" 
              alt="${text || ''}"
              title="${title || ''}"
              class="rounded-lg w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
            />
            ${title ? `<figcaption class="text-center text-gray-400 mt-4 text-sm italic">${title}</figcaption>` : ''}
          </figure>
        `;
      }
    })
  });

  // Handle FAQ section
  if (processedContent.includes('Frequently Asked Questions')) {
    const faqSection = processedContent.split('Frequently Asked Questions')[1];
    const faqItems = faqSection.split(/\n\n/).filter(item => item.includes('?'));
    
    const faqHtml = `
      <div class="mt-12 mb-8">
        <h2 class="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
        <div class="space-y-6">
          ${faqItems.map(item => {
            const [question, answer] = item.split('\n');
            return `
              <div class="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                <h3 class="text-lg font-semibold text-white mb-3">${question.trim()}</h3>
                <p class="text-gray-300">${answer.trim()}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    processedContent = processedContent.replace(faqSection, faqHtml);
  }

  return processedContent;
}

export default function BlogPostComponent({ post, isPreview = false }: { post: BlogPost; isPreview?: boolean }) {
  const [renderedContent, setRenderedContent] = useState<{ __html: string }>({ __html: '' });

  useEffect(() => {
    if (!post?.content) {
      console.error('[BlogPost] Missing content for post:', post?.title);
      return;
    }

    try {
      // First, process any image URLs in the content
      let processedContent = post.content.replace(
        /!\[(.*?)\]\((\/\/.*?)\)/g,
        (match, alt, url) => `![${alt}](https:${url})`
      );

      // Then format the content
      const formattedContent = formatContent(processedContent);
      console.log('[BlogPost] Content processed successfully');
      setRenderedContent({ __html: formattedContent });
    } catch (error) {
      console.error('[BlogPost] Error processing content:', error);
      setRenderedContent({ __html: post.content });
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

  if (isPreview) {
    const postUrl = post.tags === 'Jerome' 
      ? `/tips/${post.slug}`
      : `/blog/posts/${post.slug}`;

    return (
      <Link href={postUrl} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48">
            <Image
              src={getImageUrl(post.image_url)}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
            <p className="text-gray-400 line-clamp-3">{post.content?.substring(0, 150)}...</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title and Date */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white leading-tight">
          {post.title}
        </h1>
        {post.published_at && (
          <time className="text-gray-400 text-lg block">
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })}
          </time>
        )}
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <div className="relative aspect-[16/9] w-full mb-12 rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={getImageUrl(post.image_url)}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div 
        dangerouslySetInnerHTML={renderedContent}
        className="prose prose-lg prose-invert max-w-none"
      />

      {/* Author Section */}
      <div className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-accent/20">
              <Image
                src="/images/onsite-blog-Jerome-image-333.jpg"
                alt="Jerome Garcia"
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">Jerome Garcia</h3>
              <p className="text-gray-400">Luxury Home Remodeling Expert</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/jerome-garcia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm shadow-lg">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Looking for Home Remodelers in Denver?
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            <strong className="text-white">Top Contractors Denver</strong> connects you with the best local professionals for all your home remodeling needs. Our directory features highly rated contractors with proven expertise and excellent customer reviews.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/contractors"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-150 ease-in-out w-full sm:w-auto"
            >
              Find a Contractor
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-white hover:bg-gray-800 transition-colors duration-150 ease-in-out w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
