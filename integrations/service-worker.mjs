// Writes dist/sw.js after the build, precaching every page and asset so the
// whole guide works offline once it has been opened once.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

export function serviceWorker() {
  let base = '/';
  return {
    name: 'booked-solid-service-worker',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await walk(root)).filter((f) => !f.endsWith('sw.js'));
        const hash = createHash('sha256');
        const urls = [];
        for (const file of files) {
          const rel = path.relative(root, file).split(path.sep).join('/');
          if (rel.endsWith('.map') || rel.endsWith('.woff')) continue; // woff2 is enough for any browser with service workers
          hash.update(rel);
          hash.update(await readFile(file));
          // Serve directory indexes by their folder URL.
          const url = rel.endsWith('index.html')
            ? base + rel.slice(0, -'index.html'.length)
            : base + rel;
          urls.push(url);
        }
        const version = hash.digest('hex').slice(0, 12);
        const sw = `// Generated at build time. Do not edit.
const CACHE = 'booked-solid-${version}';
const BASE = ${JSON.stringify(base)};
const PRECACHE = ${JSON.stringify(urls)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('booked-solid-') && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(BASE + '404.html'));
    })
  );
});
`;
        await writeFile(path.join(root, 'sw.js'), sw);
        logger.info(`sw.js written: ${urls.length} files precached (cache ${version})`);
      },
    },
  };
}
