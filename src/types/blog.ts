export interface BlogPost {
  id: string;           // uuid
  content: string;      // text
  title: string;        // text
  slug: string | null;  // text, nullable
  created_at: string | null;  // text, nullable
  tags: string | null;  // text, nullable
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
