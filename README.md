This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO Improvements

This project includes various SEO optimizations to improve search engine visibility and user experience:

### Implemented Features

1. **Google Analytics Integration**
   - Google Analytics 4 integration for tracking user behavior
   - Custom events tracking for key user interactions
   - Replace "G-MEASUREMENT_ID" with your actual Google Analytics ID

2. **Technical SEO**
   - Canonical URLs to prevent duplicate content issues
   - Sitemap.xml generation with properly formatted URLs
   - Enhanced robots.txt configuration
   - Mobile-specific metadata for better mobile search optimization
   - Improved Next.js configuration for better performance

3. **Structured Data**
   - JSON-LD implementation for blog posts to enhance search result appearance
   - Article-specific metadata for better content indexing
   - Proper authorship attribution

4. **Social Media & Sharing**
   - Enhanced OpenGraph tags for better social media sharing
   - Twitter Card support for improved Twitter sharing
   - Proper image dimensions and formats for social sharing

5. **Performance Optimization**
   - Image optimization enabled
   - Additional image domains for better resource loading
   - Core Web Vitals optimization through Next.js config
   - Trailing slash standardization

### How to Maintain

- Run the sitemap generator script after adding new content: `node scripts/generate-sitemap.js`
- Update Google Analytics ID in `src/app/layout.tsx` with your actual measurement ID
- Ensure all blog posts have proper metadata including titles, descriptions, and images
- Verify structured data using Google's Rich Results Test after making changes

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
