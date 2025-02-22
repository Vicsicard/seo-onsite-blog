const { generateSitemap } = require('../src/lib/sitemap');

async function main() {
  try {
    await generateSitemap();
    console.log('✅ Sitemap generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
