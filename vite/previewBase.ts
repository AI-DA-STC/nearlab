import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Lets the same code build twice: the live site at `/`, and the test copy of
 * the `development` branch at `/preview/` (see .github/workflows/deploy.yml).
 *
 * The site names its files by absolute path (`/uploads/people/william.jpeg`),
 * in the code and inside the blog markdown. Under `/preview/` those paths would
 * load the live site's files, so a photo or post changed on `development`
 * would not show in the preview. When the build's base is not `/`, this plugin
 * puts the base in front of every `/uploads/` path, and marks the page
 * `noindex` so search engines list only the live site.
 *
 * With the default base `/` it changes nothing: the live build is untouched.
 */
const UPLOADS_IN_CODE = /(['"`])\/uploads\//g;
const UPLOADS_IN_MARKDOWN = /([("'\s=])\/uploads\//g;

function markdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

export function previewBase(): Plugin {
  let base = '/';
  let outDir = 'dist';
  const active = () => base !== '/';

  return {
    name: 'preview-base',
    configResolved(config) {
      base = config.base;
      outDir = config.build.outDir;
    },
    transform(code, id) {
      if (!active() || id.includes('node_modules') || !code.includes('/uploads/')) return null;
      return { code: code.replace(UPLOADS_IN_CODE, `$1${base}uploads/`), map: null };
    },
    transformIndexHtml(html) {
      if (!active()) return html;
      return html.replace('<head>', '<head>\n    <meta name="robots" content="noindex" />');
    },
    closeBundle() {
      if (!active()) return;
      const uploads = join(outDir, 'uploads');
      for (const file of markdownFiles(uploads)) {
        const text = readFileSync(file, 'utf8');
        const moved = text.replace(UPLOADS_IN_MARKDOWN, `$1${base}uploads/`);
        if (moved !== text) writeFileSync(file, moved);
      }
    },
  };
}
