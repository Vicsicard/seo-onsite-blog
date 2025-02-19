import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { post, error } = await fetchPostBySlug(params.slug);
  
  if (error || !post) {
    return {
      title: 'Post Not Found | Denver Luxury Home Remodeling',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Denver Luxury Home Remodeling`,
    description: post.excerpt || post.description || 'Read this insightful article about luxury home remodeling in Denver.',
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { post, error } = await fetchPostBySlug(params.slug);

  if (error) {
    console.error('[BlogPostPage] Error fetching post:', error);
    throw new Error('Failed to load blog post');
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <BlogPost post={post} isPreview={false} />
        </article>
      </main>
    </div>
  );
}
