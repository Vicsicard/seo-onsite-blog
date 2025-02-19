import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || '';

export async function GET() {
  const results: any[] = [];
  
  try {
    // Test 1: Check environment variables
    results.push({
      step: 'Environment Check',
      success: true,
      data: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }
    });

    // Test 2: Create client
    const supabase = createClient(supabaseUrl, supabaseKey);
    results.push({
      step: 'Client Creation',
      success: true
    });

    // Test 3: Basic query
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('count');

    if (postsError) throw postsError;

    results.push({
      step: 'Basic Query',
      success: true,
      data: { count: posts?.[0]?.count }
    });

    return NextResponse.json({ 
      success: true, 
      results 
    });

  } catch (error) {
    results.push({
      step: 'Error',
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details
      }
    });

    return NextResponse.json({ 
      success: false, 
      results
    }, { status: 500 });
  }
}
