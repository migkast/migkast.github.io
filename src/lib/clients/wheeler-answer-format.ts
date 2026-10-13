import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// Render saved Markdown at build time. Never trust raw model HTML or link schemes.
export function formatRecordedAnswer(answer: string): string {
  return sanitizeHtml(marked.parse(answer, { async: false, gfm: true }) as string, {
    allowedTags: ['p', 'br', 'strong', 'em', 'del', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a'],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'], ol: ['start'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    transformTags: { a: (_tag, attributes) => ({ tagName: 'a', attribs: { ...attributes, target: '_blank', rel: 'noopener noreferrer' } }) },
  });
}
