// Builds a link that respects the GitHub Pages base path (e.g. /StudioApp/).
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  if (!clean) return `${base}/`;
  const withSlash = /\.[a-z0-9]+$/i.test(clean) || clean.endsWith('/') || clean.includes('#') ? clean : `${clean}/`;
  return `${base}/${withSlash}`;
}

export const tools = [
  { slug: 'break-even', title: 'Break-even and lease test', blurb: 'How many hours you must book each week to cover rent and pay yourself.' },
  { slug: 'podcast-money', title: 'Podcast money', blurb: 'What ads would really pay at your download numbers, compared with selling production.' },
  { slug: 'gear-payback', title: 'Gear payback', blurb: 'How many months a purchase or build-out takes to pay for itself.' },
  { slug: 'startup-budget', title: 'Startup budget and runway', blurb: 'One-time costs, monthly costs and how long your cash lasts.' },
] as const;

export type ToolSlug = (typeof tools)[number]['slug'];

export function toolTitle(slug: string): string {
  return tools.find((t) => t.slug === slug)?.title ?? slug;
}

// Count Markdown task-list items so the progress page knows each stage's total.
export function countChecklist(body = ''): number {
  return (body.match(/^\s*[-*] \[ \] /gm) || []).length;
}

// Curly quotes and apostrophes for frontmatter text (Markdown bodies get this automatically).
export function smart(text = ''): string {
  return text
    .replace(/(^|[\s(\[{—-])"/g, '$1\u201c')
    .replace(/"/g, '\u201d')
    .replace(/(^|[\s(\[{—-])'/g, '$1\u2018')
    .replace(/'/g, '\u2019');
}
