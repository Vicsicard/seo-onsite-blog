import { fetchAllPosts } from '@/lib/api';
import BlogPost from './BlogPost';

export default async function FeaturedPosts() {
  const { posts } = await fetchAllPosts({ limit: 3 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} isPreview={true} />
      ))}
    </div>
  );
}
