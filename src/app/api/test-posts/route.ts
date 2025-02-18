import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';
import { marked } from 'marked';

export async function GET() {
  try {
    // Fetch the specific post
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', 'how-to-optimize-your-resume-for-ats')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Convert markdown content to HTML
    const htmlContent = marked(data.content);

    // Parse tags
    const tags = data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [];

    const formattedPost = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: htmlContent,
      created_at: data.created_at,
      tags: tags
    };

    return NextResponse.json({
      success: true,
      post: formattedPost
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
