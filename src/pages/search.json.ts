import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { url, tools } from '../lib/url';

// Strip Markdown down to plain text for the client-side search index.
const plain = (md = '') =>
  md
    .replace(/^---[\s\S]*?---/, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/- \[ \]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async () => {
  const guide = await getCollection('guide');
  const templates = await getCollection('templates');
  const items = [
    ...guide
      .sort((a, b) => a.data.order - b.data.order)
      .map((e) => ({
        kind: `Stage ${e.data.order}`,
        title: e.data.title,
        url: url(`guide/${e.id}`),
        summary: e.data.summary,
        text: plain(`${e.data.trap} ${e.body} ${e.data.nextMoves.join(' ')}`),
      })),
    ...tools.map((t) => ({ kind: 'Tool', title: t.title, url: url(`tools/${t.slug}`), summary: t.blurb, text: '' })),
    ...templates.map((t) => ({ kind: 'Paperwork', title: t.data.title, url: url(`templates/${t.id}`), summary: t.data.summary, text: plain(t.body) })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};
