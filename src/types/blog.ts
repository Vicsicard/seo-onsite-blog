export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  published_date: string;
  updated_date?: string;
  featured_image_url?: string;
  tags?: string[];
}
