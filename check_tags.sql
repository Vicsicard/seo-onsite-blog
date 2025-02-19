-- Query to see all unique tags
SELECT DISTINCT tags
FROM blog_posts
WHERE tags IS NOT NULL
ORDER BY tags;

-- Query to see all posts with their slugs and tags
SELECT slug, tags, title
FROM blog_posts
WHERE tags IS NOT NULL
ORDER BY created_at DESC;

-- Query to specifically look for posts with 'Jerome' in tags
SELECT slug, tags, title
FROM blog_posts
WHERE tags ILIKE '%Jerome%'
ORDER BY created_at DESC;
