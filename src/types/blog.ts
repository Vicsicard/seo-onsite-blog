export interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  description: string | null;
  tags: string | null;
  image_url: string | null;
  images?: ImageItem[] | null;
  excerpt?: string;
  updated_at?: string;
}

// Define the structure for image items in the array
export interface ImageItem {
  url: string;
  alt?: string;
  position?: number;
}

// Helper function to parse tags string into array
export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    // If tags is a comma-separated string
    return tags.split(',').map(tag => tag.trim());
  }
}

// Helper function to truncate text for descriptions
export function truncateText(text: string | null, maxLength: number = 150): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
