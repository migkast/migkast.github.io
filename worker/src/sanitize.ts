import sanitizeHtml from 'sanitize-html';

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'a', 'figure', 'figcaption',
      'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'sup', 'sub',
      'dl', 'dt', 'dd', 'abbr', 'mark'
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      th: ['scope', 'colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      abbr: ['title']
    },
    allowedClasses: { code: [/^language-[a-z0-9_-]+$/i] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
    transformTags: {
      h1: 'h2',
      a: (_tagName, attributes) => {
        const external = /^https?:\/\//i.test(attributes.href || '');
        const attribs = { ...attributes };
        if (external) attribs.rel = 'noopener noreferrer';
        if (attribs.target !== '_blank') delete attribs.target;
        return {
          tagName: 'a',
          attribs
        };
      },
      img: (_tagName, attributes) => {
        const attribs: Record<string, string> = { alt: attributes.alt || '', loading: 'lazy' };
        if (attributes.src) attribs.src = attributes.src;
        if (attributes.title) attribs.title = attributes.title;
        if (isDimension(attributes.width)) attribs.width = attributes.width;
        if (isDimension(attributes.height)) attribs.height = attributes.height;
        return { tagName: 'img', attribs };
      }
    }
  }).trim();
}

export function articleText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}

function isDimension(value: string | undefined): value is string {
  return typeof value === 'string' && /^\d{1,5}$/.test(value);
}
