import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  console.log('[TipPage] Generating metadata for slug:', params.slug);
  
  try {
    const { post } = await fetchPostBySlug(params.slug, true);
    
    if (!post) {
      console.log('[TipPage] No post found for metadata');
      return {
        title: 'Tip Not Found | Jerome\'s Tips',
        description: 'The requested tip could not be found.',
      };
    }

    console.log('[TipPage] Generated metadata for:', post.title);
    return {
      title: `${post.title} | Jerome's Tips`,
      description: post.excerpt || post.description || `Read ${post.title} - Jerome's insider tips on luxury home remodeling.`,
      openGraph: {
        title: `${post.title} | Jerome's Tips`,
        description: post.excerpt || post.description || `Read ${post.title} - Jerome's insider tips on luxury home remodeling.`,
        url: `https://luxuryhomeremodelingdenver.com/tips/${post.slug}`,
        siteName: 'Denver Luxury Home Remodeling',
        images: [
          {
            url: post.image_url || '/images/onsite-blog-luxury-home-image-444444.jpg',
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
    console.error('[TipPage] Error in generateMetadata:', error);
    return {
      title: 'Error | Jerome\'s Tips',
      description: 'An error occurred while loading this tip.',
    };
  }
}

export default async function TipPost({
  params,
}: Props) {
  console.log('[TipPage] Starting to render for slug:', params.slug);
  
  try {
    console.log('[TipPage] Calling fetchPostBySlug with:', {
      slug: params.slug,
      isTip: true,
      decodedSlug: decodeURIComponent(params.slug)
    });
    
    const { post, error } = await fetchPostBySlug(params.slug, true);

    console.log('[TipPage] fetchPostBySlug result:', {
      hasPost: !!post,
      error,
      postTitle: post?.title,
      postSlug: post?.slug,
      postTags: post?.tags
    });

    if (error || !post) {
      console.error('[TipPage] Error loading tip:', error);
      notFound();
    }

    console.log('[TipPage] Successfully loaded post:', {
      title: post.title,
      slug: post.slug,
      contentLength: post.content?.length,
      hasContent: !!post.content,
      tags: post.tags
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
    console.error('[TipPage] Unexpected error:', error);
    throw error;
  }
}
