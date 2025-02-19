export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  description?: string;
  image_url?: string;
  tags?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}
