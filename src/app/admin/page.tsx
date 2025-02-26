'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioxyvgkpkgkpiwfgcjhx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHl2Z2twa2drcGl3Zmdnamh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MTEzMTksImV4cCI6MjAwNDI4NzMxOX0.YPOtPJJCwcF2UX4L8mjbhbqnXPUY4WHiLaH4NROlCyk';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [postsWithoutTags, setPostsWithoutTags] = useState<any[]>([]);
  const [kitchenPosts, setKitchenPosts] = useState<any[]>([]);
  const [bathroomPosts, setBathroomPosts] = useState<any[]>([]);
  const [homePosts, setHomePosts] = useState<any[]>([]);
  const [jeromePosts, setJeromePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch all blog posts
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, tags');
        
        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No data received from Supabase');
        }
        
        setPosts(data);
        
        // Process tag counts
        const counts: Record<string, number> = {};
        const noTags: any[] = [];
        
        data.forEach((post: any) => {
          if (!post.tags) {
            noTags.push(post);
            return;
          }
          
          const tag = post.tags.trim();
          counts[tag] = (counts[tag] || 0) + 1;
        });
        
        setTagCounts(counts);
        setPostsWithoutTags(noTags);
        
        // Filter posts by tag
        setKitchenPosts(data.filter((post: any) => post.tags && post.tags.toLowerCase().includes('kitchen')));
        setBathroomPosts(data.filter((post: any) => post.tags && post.tags.toLowerCase().includes('bathroom')));
        setHomePosts(data.filter((post: any) => {
          if (!post.tags) return false;
          const tagsLower = post.tags.toLowerCase();
          return tagsLower.includes('home') && 
                !tagsLower.includes('kitchen') && 
                !tagsLower.includes('bathroom');
        }));
        setJeromePosts(data.filter((post: any) => post.tags === 'Jerome'));
        
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Error</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Tag Counts ({Object.keys(tagCounts).length} unique tags)</h2>
          <div className="overflow-auto max-h-96">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left border">Tag</th>
                  <th className="p-2 text-left border">Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tagCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tag, count], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2 border">{tag}</td>
                      <td className="p-2 border">{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Posts Without Tags ({postsWithoutTags.length})</h2>
          <div className="overflow-auto max-h-96">
            <ul className="list-disc pl-5">
              {postsWithoutTags.map((post, index) => (
                <li key={index} className="mb-1">{post.title} (ID: {post.id})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Kitchen Posts ({kitchenPosts.length})</h2>
          <div className="overflow-auto max-h-96">
            <ul className="list-disc pl-5">
              {kitchenPosts.map((post, index) => (
                <li key={index} className="mb-1">{post.title} <span className="text-gray-500">({post.tags})</span></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Bathroom Posts ({bathroomPosts.length})</h2>
          <div className="overflow-auto max-h-96">
            <ul className="list-disc pl-5">
              {bathroomPosts.map((post, index) => (
                <li key={index} className="mb-1">{post.title} <span className="text-gray-500">({post.tags})</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Home Remodeling Posts ({homePosts.length})</h2>
          <div className="overflow-auto max-h-96">
            <ul className="list-disc pl-5">
              {homePosts.map((post, index) => (
                <li key={index} className="mb-1">{post.title} <span className="text-gray-500">({post.tags})</span></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Jerome Posts ({jeromePosts.length})</h2>
          <div className="overflow-auto max-h-96">
            <ul className="list-disc pl-5">
              {jeromePosts.map((post, index) => (
                <li key={index} className="mb-1">{post.title} <span className="text-gray-500">({post.tags})</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
