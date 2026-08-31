export interface ArticleSection {
  id: string;
  title: string;
}

export function prepareArticleHtml(source: string): { html: string; sections: ArticleSection[] } {
  const sections: ArticleSection[] = [];
  const usedIds = new Set<string>();

  const withSectionIds = source.replace(/<h2>([\s\S]*?)<\/h2>/gi, (_match, innerHtml: string) => {
    const title = decodeHtml(stripTags(innerHtml)).replace(/\s+/g, ' ').trim();
    if (!title) return `<h2>${innerHtml}</h2>`;

    const baseId = slugify(title) || `section-${sections.length + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    sections.push({ id, title });
    return `<h2 id="${id}">${innerHtml}</h2>`;
  });

  const html = withSectionIds
    .replaceAll('<table>', '<div class="blog-table-scroll" role="region" aria-label="Scrollable data table" tabindex="0"><table>')
    .replaceAll('</table>', '</table></div>');

  return { html, sections };
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

function decodeHtml(value: string): string {
  const entities: Record<string, string> = {
    amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"'
  };

  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, key: string) => {
    if (key[0] === '#') {
      const codePoint = key[1]?.toLowerCase() === 'x'
        ? Number.parseInt(key.slice(2), 16)
        : Number.parseInt(key.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    return entities[key.toLowerCase()] ?? entity;
  });
}
