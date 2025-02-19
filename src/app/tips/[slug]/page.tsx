import { Metadata } from 'next';
import { fetchPostBySlug } from '@/lib/api';
import BlogPost from '@/components/BlogPost';
import Header from '@/components/Header';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post, error } = await fetchPostBySlug(params.slug);

  if (error || !post) {
    return {
      title: 'Post Not Found | Jerome\'s Tips',
      description: 'The requested tip could not be found.',
    };
  }

  return {
    title: `${post.title} | Jerome's Tips`,
    description: post.excerpt || post.description,
    openGraph: {
      title: `${post.title} | Jerome's Tips`,
      description: post.excerpt || post.description,
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
  const { post, error } = await fetchPostBySlug(params.slug);

  if (error || !post) {
    throw new Error('Failed to load tip post');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogPost post={post} />
      </main>
    </div>
  );
}
