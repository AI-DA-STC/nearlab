import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';
import type { Plugin } from 'vite';

/**
 * `virtual:news-images` — every photo in each `public/uploads/news/<folder>/`,
 * so dropping a file into a folder is all it takes to add it to that news
 * item's gallery. Each entry carries the pixel size the gallery needs to lay
 * out its rows before the files arrive, read here from the file headers.
 *
 * When a photo exists in several formats (`a.png` and its `a.webp`), only the
 * WebP is listed.
 */
const ID = 'virtual:news-images';
const RESOLVED = `\0${ID}`;
const ROOT = 'public/uploads/news';
const EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'];

interface Size {
  width: number;
  height: number;
}

function pngSize(b: Buffer): Size | null {
  if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function webpSize(b: Buffer): Size | null {
  if (b.length < 30 || b.toString('ascii', 0, 4) !== 'RIFF') return null;
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') {
    return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  if (kind === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (kind === 'VP8 ') {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

/** EXIF orientation 5–8 means the browser shows the photo turned a quarter. */
function exifTurnsQuarter(b: Buffer, start: number, end: number): boolean {
  if (b.toString('ascii', start + 4, start + 8) !== 'Exif') return false;
  const tiff = start + 10;
  const little = b.toString('ascii', tiff, tiff + 2) === 'II';
  const u16 = (o: number) => (little ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const u32 = (o: number) => (little ? b.readUInt32LE(o) : b.readUInt32BE(o));
  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > end) return false;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > end) break;
    if (u16(entry) === 0x0112) {
      const orientation = u16(entry + 8);
      return orientation >= 5 && orientation <= 8;
    }
  }
  return false;
}

function jpegSize(b: Buffer): Size | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let turned = false;
  let offset = 2;
  while (offset + 4 <= b.length) {
    if (b[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = b[offset + 1]!;
    if (marker === 0xff) {
      offset++;
      continue;
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const length = b.readUInt16BE(offset + 2);
    if (marker === 0xe1) turned = exifTurnsQuarter(b, offset + 4, offset + 2 + length);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = b.readUInt16BE(offset + 5);
      const width = b.readUInt16BE(offset + 7);
      return turned ? { width: height, height: width } : { width, height };
    }
    offset += 2 + length;
  }
  return null;
}

function sizeOf(path: string): Size {
  const bytes = readFileSync(path);
  return pngSize(bytes) ?? webpSize(bytes) ?? jpegSize(bytes) ?? { width: 4, height: 3 };
}

function listFolder(folder: string): { src: string; width: number; height: number }[] {
  const dir = join(ROOT, folder);
  const chosen = new Map<string, string>();
  for (const file of readdirSync(dir)) {
    const { name, ext } = parse(file);
    const rank = EXTENSIONS.indexOf(ext.toLowerCase());
    if (rank < 0) continue;
    const held = chosen.get(name);
    if (!held || rank < EXTENSIONS.indexOf(parse(held).ext.toLowerCase())) chosen.set(name, file);
  }
  return [...chosen.values()]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((file) => ({ src: `/uploads/news/${folder}/${file}`, ...sizeOf(join(dir, file)) }));
}

function build(): Record<string, { src: string; width: number; height: number }[]> {
  const folders: Record<string, { src: string; width: number; height: number }[]> = {};
  if (!existsSync(ROOT)) return folders;
  for (const entry of readdirSync(ROOT)) {
    if (statSync(join(ROOT, entry)).isDirectory()) folders[entry] = listFolder(entry);
  }
  return folders;
}

export function newsImages(): Plugin {
  return {
    name: 'news-images',
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    load(id) {
      if (id !== RESOLVED) return undefined;
      return `export default ${JSON.stringify(build())};`;
    },
    configureServer(server) {
      // New or removed photos reload the page; the list is rebuilt on request.
      const refresh = (file: string) => {
        if (!file.replaceAll('\\', '/').includes(`/${ROOT}/`)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('unlink', refresh);
    },
  };
}
