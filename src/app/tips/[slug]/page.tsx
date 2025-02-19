import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  console.log('[TipsPage] Generating metadata for slug:', params.slug);
  const { post, error } = await fetchPostBySlug(params.slug, true);

  if (error) {
    console.error('[TipsPage] Error generating metadata:', error);
    return {
      title: 'Tip Not Found | Jerome\'s Tips',
      description: 'The requested tip could not be found.',
    };
  }

  if (!post) {
    console.log('[TipsPage] No post found for metadata');
    return {
      title: 'Tip Not Found | Jerome\'s Tips',
      description: 'The requested tip could not be found.',
    };
  }

  console.log('[TipsPage] Generated metadata for:', post.title);
  return {
    title: `${post.title} | Jerome's Tips`,
    description: post.excerpt || post.description || '',
    openGraph: {
      title: `${post.title} | Jerome's Tips`,
      description: post.excerpt || post.description || '',
      url: `https://luxuryhomeremodelingdenver.com/tips/${post.slug}`,
      siteName: 'Denver Luxury Home Remodeling',
      images: [
        {
          url: post.image_url || 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-outdoor-backyard-image-3333333333.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
  };
}

export default async function TipPost({ params }: Props) {
  console.log('[TipsPage] Starting to render tip page for slug:', params.slug);
  
  try {
    const { post, error } = await fetchPostBySlug(params.slug, true);

    if (error) {
      console.error('[TipsPage] Error loading tip:', error);
      throw error;
    }

    if (!post) {
      console.error('[TipsPage] No tip found with slug:', params.slug);
      throw new Error('Tip not found');
    }

    console.log('[TipsPage] Successfully loaded tip:', {
      title: post.title,
      slug: post.slug,
      contentLength: post.content?.length,
      hasContent: !!post.content,
      tags: post.tags
    });

    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BlogPost post={post} />
        </main>
      </div>
    );
  } catch (error) {
    console.error('[TipsPage] Render error:', error);
    throw error;
  }
}
