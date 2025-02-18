export interface BlogPost {
  id: string;
  content: string;
  title: string;
  slug: string | null;
  created_at: string | null;
  tags: string | null;
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
