// pages/api/export.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Blog ID is required' });
  }

  try {
    // Simulate fetching the blog post from Supabase
    const blogPost = {
      title: 'Sample Blog Post',
      content: 'This is a sample blog post content.',
    };

    // Simulate converting the content to a .txt file
    const fileContent = `Title: ${blogPost.title}\n\n${blogPost.content}`;
    const fileName = `blog-${id}.txt`;

    // Simulate uploading to Supabase Storage and returning a download link
    const downloadLink = `https://example.com/storage/${fileName}`;

    res.status(200).json({ downloadLink });
  } catch (error) {
    console.error('Error exporting blog post:', error);
    res.status(500).json({ error: 'Failed to export blog post' });
  }
}
