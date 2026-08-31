import { Marked } from 'marked';

/**
 * Markdown -> HTML, plus the heading outline the page needs for its contents
 * rail.
 *
 * The source files are committed under `public/uploads/`, so they carry the
 * same trust as the code that renders them: raw HTML in a post is authored by
 * the lab, not submitted by a reader, and is passed through rather than
 * escaped. Anything fetched from outside the repo would need sanitising first.
 */

/** One entry in a post's contents rail. */
export interface Heading {
  /** `id` of the rendered heading, and the fragment that links to it. */
  readonly id: string;
  readonly text: string;
  /** 2 for a section, 3 for a subsection. */
  readonly depth: number;
}

export interface MarkdownDoc {
  /** Front-matter keys, verbatim. Posts use this to carry their byline. */
  readonly meta: Readonly<Record<string, string>>;
  readonly html: string;
  /** `##` and `###` headings, in document order. */
  readonly headings: readonly Heading[];
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Leading `--- key: value ---` block, split off from the body. */
function splitFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = FRONT_MATTER.exec(raw);
  if (!match?.[1]) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    if (key) meta[key] = line.slice(separator + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

/** A heading's text as a URL fragment. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function renderMarkdown(raw: string): MarkdownDoc {
  const { meta, body } = splitFrontMatter(raw);
  const headings: Heading[] = [];
  const used = new Set<string>();

  // A fresh instance per call: `marked.use` on the shared default would let one
  // post's heading collector leak into the next.
  const parser = new Marked({
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens);
        // Two sections can share a name, but their fragments cannot.
        const base = slugify(token.text) || 'section';
        let id = base;
        for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
        used.add(id);

        if (token.depth === 2 || token.depth === 3) {
          headings.push({ id, text: token.text, depth: token.depth });
        }
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
      },
    },
  });

  return { meta, html: parser.parse(body, { async: false }), headings };
}
