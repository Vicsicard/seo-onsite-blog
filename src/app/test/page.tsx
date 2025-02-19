import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || '';

export default async function TestPage() {
  const logs: any[] = [];
  let error = null;

  try {
    logs.push({
      step: 'Environment Variables',
      data: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl.substring(0, 10) + '...',
        keyPrefix: supabaseKey.substring(0, 10) + '...'
      }
    });

    // Test 1: Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    logs.push({ step: 'Supabase Client', data: 'Created successfully' });

    // Test 2: Query all posts
    const { data: allPosts, error: allPostsError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .limit(5);

    if (allPostsError) throw allPostsError;
    logs.push({ 
      step: 'All Posts Query',
      data: {
        count: allPosts?.length,
        sample: allPosts?.slice(0, 2)
      }
    });

    // Test 3: Query posts with 'jerome' tag
    const { data: jeromePosts, error: jeromeError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, tags')
      .or('tags.cs.{jerome},tags.ilike.%"jerome"%,tags.ilike.%jerome%')
      .limit(5);

    if (jeromeError) throw jeromeError;
    logs.push({ 
      step: 'Jerome Posts Query',
      data: {
        count: jeromePosts?.length,
        sample: jeromePosts?.slice(0, 2)
      }
    });

    // Test 4: Get a single post with full content
    if (allPosts?.[0]) {
      const { data: singlePost, error: singleError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', allPosts[0].id)
        .single();

      if (singleError) throw singleError;
      logs.push({ 
        step: 'Single Post Query',
        data: {
          id: singlePost?.id,
          title: singlePost?.title,
          hasContent: !!singlePost?.content,
          contentLength: singlePost?.content?.length
        }
      });
    }

  } catch (e) {
    error = e;
    logs.push({ 
      step: 'Error',
      data: {
        message: e.message,
        code: e.code,
        details: e.details
      }
    });
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      {error && (
        <div className="mb-8 p-4 bg-red-900 rounded">
          <h2 className="text-xl font-bold mb-2">Error Occurred</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-6">
        {logs.map((log, i) => (
          <div key={i} className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-bold mb-2">{log.step}</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
