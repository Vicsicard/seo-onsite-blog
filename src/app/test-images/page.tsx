'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TestImages() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        // Fetch posts directly from Supabase
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, content, tags')
          .limit(10);

        if (error) {
          throw error;
        }

        // Process posts to extract images
        const processedPosts = data.map((post: any) => {
          // Extract image from content using regex
          let imageUrl = null;
          if (post.content) {
            // Try multiple patterns
            const markdownImgMatch = post.content.match(/!\[.*?\]\((.*?)\)/);
            const htmlImgMatch = post.content.match(/<img.*?src=["'](.*?)["']/i);
            
            if (markdownImgMatch) {
              imageUrl = markdownImgMatch[1];
            } else if (htmlImgMatch) {
              imageUrl = htmlImgMatch[1];
            }
            
            // Handle protocol-relative URLs
            if (imageUrl && imageUrl.startsWith('//')) {
              imageUrl = `https:${imageUrl}`;
            }
          }

          return {
            ...post,
            extractedImageUrl: imageUrl
          };
        });

        setPosts(processedPosts);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>
      <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
        Back to Home
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-2">Tags: {post.tags || 'None'}</p>
              
              {post.extractedImageUrl ? (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Image from content:</h3>
                  <div className="relative h-40 w-full mb-2">
                    <img 
                      src={post.extractedImageUrl}
                      alt={`Image for ${post.title}`}
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        console.error('Image error:', post.extractedImageUrl);
                        (e.target as HTMLImageElement).src = '/images/onsite-blog-luxury-home-image-444444.jpg';
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    Image URL: {post.extractedImageUrl}
                  </div>
                </div>
              ) : (
                <div className="mb-4 text-red-500">No image found in content</div>
              )}
              
              <div className="text-sm italic">
                <Link href={`/blog/posts/${post.slug}`} className="text-blue-500 hover:text-blue-700">
                  View Post
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
