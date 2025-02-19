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
  console.log('[BlogPostPage] Generating metadata for slug:', params.slug);
  
  try {
    const { post, error } = await fetchPostBySlug(params.slug);
    
    if (error) {
      console.error('[BlogPostPage] Error generating metadata:', error);
      return {
        title: 'Post Not Found | Denver Luxury Home Remodeling',
        description: 'The requested blog post could not be found.',
      };
    }

    if (!post) {
      console.log('[BlogPostPage] No post found for metadata');
      return {
        title: 'Post Not Found | Denver Luxury Home Remodeling',
        description: 'The requested blog post could not be found.',
      };
    }

    console.log('[BlogPostPage] Generated metadata for:', post.title);
    return {
      title: `${post.title} | Denver Luxury Home Remodeling`,
      description: post.excerpt || post.description || 'Read this insightful article about luxury home remodeling in Denver.',
      openGraph: {
        title: `${post.title} | Denver Luxury Home Remodeling`,
        description: post.excerpt || post.description || 'Read this insightful article about luxury home remodeling in Denver.',
        url: `https://luxuryhomeremodelingdenver.com/blog/posts/${post.slug}`,
        siteName: 'Denver Luxury Home Remodeling',
        images: [
          {
            url: post.image_url || '/images/default-blog.jpg',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
    };
  } catch (error) {
    console.error('[BlogPostPage] Error in generateMetadata:', error);
    return {
      title: 'Error | Denver Luxury Home Remodeling',
      description: 'An error occurred while loading the blog post.',
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log('[BlogPostPage] Starting to render for slug:', params.slug);
  
  try {
    const { post, error } = await fetchPostBySlug(params.slug);

    if (error) {
      console.error('[BlogPostPage] Error fetching post:', error);
      throw error;
    }

    if (!post) {
      console.log('[BlogPostPage] No post found with slug:', params.slug);
      notFound();
    }

    console.log('[BlogPostPage] Successfully loaded post:', {
      title: post.title,
      slug: post.slug,
      contentLength: post.content?.length,
      hasContent: !!post.content
    });

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
  } catch (error) {
    console.error('[BlogPostPage] Render error:', error);
    throw error;
  }
}
