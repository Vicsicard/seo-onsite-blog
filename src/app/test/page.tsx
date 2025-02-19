import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';

export default async function TestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Configuration Error</h1>
            <p className="text-xl mb-4">Missing environment variables</p>
            <pre className="text-left bg-gray-800 p-4 rounded-lg">
              NEXT_PUBLIC_BLOG_SUPABASE_URL: {supabaseUrl ? 'Set' : 'Not set'}
              NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY: {supabaseKey ? 'Set' : 'Not set'}
            </pre>
          </div>
        </main>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('blog_posts')
      .select('count');

    if (testError) {
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Database Connection Error</h1>
              <p className="text-xl mb-4">Error connecting to database:</p>
              <pre className="text-left bg-gray-800 p-4 rounded-lg">
                {JSON.stringify(testError, null, 2)}
              </pre>
            </div>
          </main>
        </div>
      );
    }

    // Test Jerome posts query
    const { data: jeromePosts, error: jeromeError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('tags', 'Jerome');

    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-8">Database Test Results</h1>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Connection Test</h2>
              <pre className="bg-gray-800 p-4 rounded-lg">
                Status: Connected
                Total Posts: {testData?.[0]?.count}
              </pre>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Jerome Posts Test</h2>
              {jeromeError ? (
                <pre className="bg-gray-800 p-4 rounded-lg text-red-400">
                  Error: {JSON.stringify(jeromeError, null, 2)}
                </pre>
              ) : (
                <div>
                  <p className="mb-4">Found {jeromePosts?.length} posts with tag "Jerome"</p>
                  <div className="space-y-4">
                    {jeromePosts?.map(post => (
                      <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold">{post.title}</h3>
                        <p className="text-gray-400">Slug: {post.slug}</p>
                        <p className="text-gray-400">Tags: {post.tags}</p>
                        <p className="text-gray-400">Has Content: {post.content ? 'Yes' : 'No'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
            <p className="text-xl mb-4">An error occurred while testing the database:</p>
            <pre className="text-left bg-gray-800 p-4 rounded-lg">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          </div>
        </main>
      </div>
    );
  }
}
