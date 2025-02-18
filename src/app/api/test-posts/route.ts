import { NextResponse } from 'next/server';
import { fetchAllPosts } from '../../../../lib/api';

export async function GET() {
  console.log('Handling GET request to /api/test-posts');
  
  try {
    console.log('Fetching all posts...');
    const posts = await fetchAllPosts();
    
    const counts = {
      home: posts.homePosts.length,
      kitchen: posts.kitchenPosts.length,
      bathroom: posts.bathroomPosts.length,
      jerome: posts.jeromePosts.length
    };

    console.log('Posts fetched successfully:', counts);
    
    return NextResponse.json({
      success: true,
      posts,
      counts,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in /api/test-posts:', err);
    
    // Determine the error type and return appropriate response
    if (err instanceof Error) {
      if (err.message.includes('connection')) {
        return NextResponse.json({ 
          error: 'Database connection error',
          message: 'Unable to connect to the database. Please try again later.',
          details: err.message
        }, { status: 503 });
      }
      
      if (err.message.includes('permission')) {
        return NextResponse.json({ 
          error: 'Permission denied',
          message: 'Not authorized to access this resource',
          details: err.message
        }, { status: 403 });
      }
    }

    // Generic error response
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
