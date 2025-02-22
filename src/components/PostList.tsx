import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface PostListProps {
  post?: BlogPost;
  posts?: BlogPost[];
}

const DEFAULT_IMAGE = '/images/onsite-blog-luxury-home-image-444444.jpg';

export default function PostList({ post, posts }: PostListProps) {
  const postsToRender = post ? [post] : posts || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {postsToRender.map((post) => (
        <Link 
          key={post.id} 
          href={`/tips/${post.slug}`}
          className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300"
        >
          <div className="relative h-48">
            <Image
              src={post.image_url || DEFAULT_IMAGE}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-400">{post.excerpt || post.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
