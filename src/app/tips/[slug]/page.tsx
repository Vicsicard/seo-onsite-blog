import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';
import NewsletterSignup from '@/components/NewsletterSignup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { slug: string };
}

function cleanSlug(slug: string): string {
  try {
    // First decode any URL-encoded characters
    const decoded = decodeURIComponent(slug);
    
    // Get the first part of the URL (before any query params)
    const urlParts = decoded.split('?');
    const baseSlug = urlParts[0];
    
    // Clean up the slug
    return baseSlug
      .replace(/['']/g, "'") // Normalize apostrophes
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[?#]/g, '-') // Replace ? and # with hyphens
      .toLowerCase()
      .trim()
      .replace(/-+/g, '-'); // Replace multiple consecutive hyphens with a single one
  } catch (e) {
    console.error('[cleanSlug] Error:', e);
    return slug;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  try {
    const cleanedSlug = cleanSlug(params.slug);
    console.log('[Metadata] Processing slug:', {
      original: params.slug,
      cleaned: cleanedSlug
    });

    const { post } = await fetchPostBySlug(cleanedSlug, true);
    
    if (!post) {
      return {
        title: 'Tip Not Found | Jerome\'s Tips',
        description: 'The requested tip could not be found.',
      };
    }

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
  try {
    const cleanedSlug = cleanSlug(params.slug);
    console.log('[TipPage] Processing slug:', {
      original: params.slug,
      cleaned: cleanedSlug
    });

    const { post, error } = await fetchPostBySlug(cleanedSlug, true);

    if (!post || error) {
      console.error('[TipPage] Error loading tip:', error);
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BlogPost post={post} isPreview={false} />
          
          {/* Newsletter Section */}
          <section className="mt-16 bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Stay Updated with Expert Tips</h2>
              <p className="text-gray-300 mb-6">
                Subscribe to receive more insights about luxury home remodeling in Denver.
              </p>
              <NewsletterSignup />
            </div>
          </section>
        </main>
      </div>
    );
  } catch (error) {
    console.error('[TipPage] Unexpected error:', error);
    throw error;
  }
}
