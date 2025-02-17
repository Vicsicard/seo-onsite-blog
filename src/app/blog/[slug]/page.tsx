import { Metadata } from 'next';
import { fetchPostBySlug, fetchPosts } from '../../../../lib/api';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import type { BlogPost } from '../../../types/blog';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.seo_description,
  };
}

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const content = await marked.parse(post.content || '');

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
        <time className="text-gray-300 text-sm" dateTime={post.published_date}>
          Published: {new Date(post.published_date).toLocaleDateString()}
        </time>
      </header>

      <div 
        className="prose-custom prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
