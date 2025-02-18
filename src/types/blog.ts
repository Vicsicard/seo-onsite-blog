export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  featured_image_url?: string;
  published_date: string;
  updated_date?: string;
  author?: string;
  category?: 'kitchen' | 'bathroom' | 'home' | 'general';
  tags?: string[];
  status: 'draft' | 'published';
  meta_data?: {
    reading_time?: number;
    views?: number;
    likes?: number;
  };
}
