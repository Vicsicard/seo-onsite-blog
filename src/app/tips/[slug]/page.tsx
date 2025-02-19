import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    if (!params.slug) {
      return {
        title: 'Tip Not Found | Jerome\'s Tips',
        description: 'The requested tip could not be found.',
      };
    }

    const { post, error } = await fetchPostBySlug(params.slug, true);

    if (error || !post || post.tags !== 'Jerome') {
      return {
        title: 'Tip Not Found | Jerome\'s Tips',
        description: 'The requested tip could not be found.',
      };
    }

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
  } catch (error) {
    console.error('[Metadata] Error generating metadata:', error);
    return {
      title: 'Error | Jerome\'s Tips',
      description: 'An error occurred while loading this tip.',
    };
  }
}

export default async function TipPost({ params }: Props) {
  if (!params.slug) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Invalid Request</h1>
            <p className="text-xl">No tip identifier provided.</p>
          </div>
        </main>
      </div>
    );
  }

  try {
    const { post, error } = await fetchPostBySlug(params.slug, true);

    if (error) {
      console.error('[TipsPage] Error fetching post:', error);
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Error Loading Tip</h1>
              <p className="text-xl">Unable to load the requested tip. Please try again later.</p>
            </div>
          </main>
        </div>
      );
    }

    if (!post || post.tags !== 'Jerome') {
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Tip Not Found</h1>
              <p className="text-xl">The requested tip could not be found.</p>
            </div>
          </main>
        </div>
      );
    }

    if (!post.content) {
      return (
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl">This tip is currently being updated. Please check back later.</p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BlogPost post={post} />
        </main>
      </div>
    );
  } catch (error) {
    console.error('[TipsPage] Unexpected error:', error);
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
            <p className="text-xl">An unexpected error occurred. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }
}
