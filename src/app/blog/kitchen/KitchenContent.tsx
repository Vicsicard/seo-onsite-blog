'use client';

import { useEffect, useState } from 'react';
import { fetchPostsByTag } from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types/blog';
import BlogGrid from '@/components/BlogGrid';

const POSTS_PER_PAGE = 9;

export default function KitchenContent() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        console.log('[KitchenContent] Fetching posts...');
        const { posts, error } = await fetchPostsByTag({ 
          tag: 'kitchen', 
          page: currentPage, 
          limit: POSTS_PER_PAGE 
        });

        if (error) {
          console.error('[KitchenContent] Error fetching posts:', error);
          throw error;
        }

        console.log('[KitchenContent] Posts fetched:', posts.map(post => ({
          id: post.id,
          title: post.title,
          imageUrl: post.image_url,
          contentLength: post.content?.length || 0
        })));
        setPosts(posts);
        
        // Calculate total pages (this should come from the API in a real app)
        setTotalPages(Math.ceil(posts.length / POSTS_PER_PAGE));
      } catch (err) {
        console.error('[KitchenContent] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [currentPage]);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  return (
    <BlogGrid
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
