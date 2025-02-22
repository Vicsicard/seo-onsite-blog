import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';

function formatContent(content: string): string {
  // Format sections and headings
  content = content
    // Format main sections (capitalized text at start of line)
    .replace(/^([A-Z][^.\n]+)$/gm, '\n## $1\n')
    // Format numbered sections with descriptions
    .replace(/(\d+\.\s+)([^–\n]+)(?:–|-)([^\n]+)/g, '\n### $2\n$3\n')
    // Add space after section headings
    .replace(/(#{2,}.*)\n([^#\n])/g, '$1\n\n$2');

  // Format lists and special characters
  content = content
    // Format checkmarks
    .replace(/✔\s*/g, '✔ ')
    // Format bullet points
    .replace(/🔹\s*/g, '🔹 ')
    // Add space before and after lists
    .replace(/(?:^|\n)(\d+\.\s+)/g, '\n\n$1')
    .replace(/(?:^|\n)((?:✔|🔹)\s+)/g, '\n\n$1')
    // Add space after list items
    .replace(/(\n\s*[-*✔🔹]\s+[^\n]+)(?=\n\s*[^-*✔🔹\n])/g, '$1\n');

  // Format special content
  content = content
    // Format ROI percentages
    .replace(/ROI:\s*(\d+%(?:\s*[-–]\s*\d+%)?)/g, '**ROI:** $1')
    // Format Pro Tips
    .replace(/Pro Tip:/g, '**Pro Tip:**')
    // Format contact information
    .replace(/📩\s*([^\n]+)/, '\n\n📩 [**$1**](mailto:$1)')
    .replace(/🔹\s*([^\n]+\.com[^\n]*)/g, '🔹 [**$1**]($1)')
    // Format signature
    .replace(/—\s*([^\n]+)/, '\n\n— *$1*');

  // Clean up spacing
  content = content
    // Ensure paragraphs have proper spacing
    .replace(/([^\n])\n([^\n])/g, '$1\n\n$2')
    // Remove excessive blank lines but preserve intentional spacing
    .replace(/\n{4,}/g, '\n\n\n')
    // Ensure proper heading hierarchy
    .replace(/^#\s+/m, '# ')
    .replace(/^##\s+/mg, '## ')
    .replace(/^###\s+/mg, '### ');

  return content;
}

export async function markdownToHtml(content: string) {
  if (!content) {
    return '';
  }

  try {
    // Format the content first
    content = formatContent(content);

    // Convert to HTML
    const result = await remark()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(html, {
        sanitize: false,
        allowDangerousHtml: true
      })
      .process(content);

    const htmlResult = result.toString()
      // Add spacing classes
      .replace(/<p>/g, '<p class="mb-6">')
      // Style checkmarks and bullet points
      .replace(/✔/g, '<span class="text-green-500 font-bold">✔</span>')
      .replace(/🔹/g, '<span class="text-blue-500">🔹</span>')
      // Add spacing between sections
      .replace(/<\/h2>\s*<p/g, '</h2>\n\n<p')
      .replace(/<\/h3>\s*<p/g, '</h3>\n\n<p')
      // Style lists
      .replace(/<ul>/g, '<ul class="space-y-4 my-8">')
      .replace(/<ol>/g, '<ol class="space-y-4 my-8">')
      // Style list items
      .replace(/<li>/g, '<li class="flex items-start gap-2">');

    return htmlResult;
  } catch (error) {
    console.error('[Markdown] Error converting markdown to HTML:', error);
    return `<p>Error converting content: ${error.message}</p>`;
  }
}
