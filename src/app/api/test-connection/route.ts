import { NextResponse } from 'next/server';
import { testSupabaseConnection, createTestPost } from '../../../../lib/api';

export async function GET() {
  try {
    // Test connection
    const connectionResult = await testSupabaseConnection();
    
    if (!connectionResult.success) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: connectionResult.error
      }, { status: 500 });
    }

    // If connection is successful, try to create a test post
    const testPost = await createTestPost();

    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Supabase',
      connection: connectionResult,
      testPost: testPost || 'No test post created'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred',
      error: String(error)
    }, { status: 500 });
  }
}
