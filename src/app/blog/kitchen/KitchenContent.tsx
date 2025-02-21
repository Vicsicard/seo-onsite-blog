'use client';

import React from 'react';
import { fetchPosts } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import { BlogPost as BlogPostType } from '@/types/blog';

export default async function KitchenContent({ page = 1 }: { page?: number }) {
  const postsPerPage = 9;
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage - 1;

  try {
    const { posts, error } = await fetchPosts('Kitchen', start, end);
    
    if (error) {
      console.error('Error fetching kitchen posts:', error);
      return <div>Error loading posts</div>;
    }

    if (!posts?.length) {
      return <div>No posts found</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: BlogPostType) => (
          <BlogPost key={post.id} post={post} isPreview={true} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error in KitchenContent:', error);
    return <div>Error loading posts</div>;
  }
}
