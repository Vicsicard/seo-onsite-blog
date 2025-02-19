import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';

// Function to ensure URL is absolute
function ensureAbsoluteUrl(url: string): string {
  // If it starts with //, add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // If it's already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it starts with /, assume it's relative to our domain
  if (url.startsWith('/')) {
    return `https://luxuryhomeremodelingdenver.com${url}`;
  }
  
  // If none of the above, assume https://
  return `https://${url}`;
}

// Custom remark plugin to fix image URLs
function remarkFixImageUrls() {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      if (node.url) {
        node.url = ensureAbsoluteUrl(node.url);
      }
    });
  };
}

export async function markdownToHtml(markdown: string) {
  if (!markdown) {
    console.warn('[Markdown] Received empty markdown content');
    return '';
  }

  try {
    const result = await remark()
      .use(remarkFixImageUrls) // Add our custom plugin to fix image URLs
      .use(html, {
        sanitize: false, // Allow all HTML
        allowDangerousHtml: true // Required for some HTML elements
      })
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error('[Markdown] Error converting markdown to HTML:', error);
    return '';
  }
}
