// Script to list all unique tags in the blog_posts table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioxyvgkpkgkpiwfgcjhx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHl2Z2twa2drcGl3Zmdnamh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MTEzMTksImV4cCI6MjAwNDI4NzMxOX0.YPOtPJJCwcF2UX4L8mjbhbqnXPUY4WHiLaH4NROlCyk';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTags() {
  try {
    // Fetch all blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, tags');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${posts.length} total blog posts`);
    
    // Count tags
    const tagCounts = {};
    const postsWithoutTags = [];
    
    posts.forEach(post => {
      if (!post.tags) {
        postsWithoutTags.push(post);
        return;
      }
      
      const tag = post.tags.trim();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // Print tag counts
    console.log('\n--- TAG COUNTS ---');
    Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => {
        console.log(`${tag}: ${count} posts`);
      });
    
    // Print posts without tags
    if (postsWithoutTags.length > 0) {
      console.log('\n--- POSTS WITHOUT TAGS ---');
      postsWithoutTags.forEach(post => {
        console.log(`- ${post.title} (ID: ${post.id})`);
      });
    }
    
    // Print kitchen posts
    console.log('\n--- KITCHEN POSTS ---');
    const kitchenPosts = posts.filter(post => post.tags && post.tags.toLowerCase().includes('kitchen'));
    kitchenPosts.forEach(post => {
      console.log(`- ${post.title} (Tag: ${post.tags})`);
    });
    
    // Print bathroom posts
    console.log('\n--- BATHROOM POSTS ---');
    const bathroomPosts = posts.filter(post => post.tags && post.tags.toLowerCase().includes('bathroom'));
    bathroomPosts.forEach(post => {
      console.log(`- ${post.title} (Tag: ${post.tags})`);
    });
    
    // Print home remodeling posts (excluding kitchen and bathroom)
    console.log('\n--- HOME REMODELING POSTS ---');
    const homePosts = posts.filter(post => {
      if (!post.tags) return false;
      const tagsLower = post.tags.toLowerCase();
      return tagsLower.includes('home') && 
             !tagsLower.includes('kitchen') && 
             !tagsLower.includes('bathroom');
    });
    homePosts.forEach(post => {
      console.log(`- ${post.title} (Tag: ${post.tags})`);
    });
    
    // Print Jerome posts
    console.log('\n--- JEROME POSTS ---');
    const jeromePosts = posts.filter(post => post.tags === 'Jerome');
    jeromePosts.forEach(post => {
      console.log(`- ${post.title} (Tag: ${post.tags})`);
    });
    
  } catch (error) {
    console.error('Error listing tags:', error);
  }
}

// Run the script
listTags();
