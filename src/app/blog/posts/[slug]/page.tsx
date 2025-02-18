import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Denver Luxury Home Remodeling',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Denver Luxury Home Remodeling`,
    description: post.excerpt || 'Read this insightful article about luxury home remodeling in Denver.',
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return (
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-200">Post Not Found</h1>
            <p className="mt-4 text-gray-400">The requested blog post could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogPost post={post} isPreview={false} />
      </main>
    </div>
  );
}
