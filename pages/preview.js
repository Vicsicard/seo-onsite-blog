// pages/preview.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blogContent, setBlogContent] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/blog/${id}`)
        .then((response) => response.json())
        .then((data) => setBlogContent(data))
        .catch((error) => console.error('Error fetching blog content:', error));
    }
  }, [id]);

  if (!blogContent) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Blog Preview</h1>
      <h2>{blogContent.title}</h2>
      <p>{blogContent.content}</p>
      <button onClick={() => router.push('/export')}>Export</button>
    </div>
  );
}
