import type { APIRoute } from 'astro';
import { url } from '../lib/url';

export const GET: APIRoute = () => {
  const manifest = {
    name: 'Booked Solid: launch a recording or podcast studio in Ontario',
    short_name: 'Booked Solid',
    description: 'A free, practical guide to launching a recording or podcast studio in Ontario.',
    id: url(''),
    start_url: url(''),
    scope: url(''),
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#f4f6f8',
    theme_color: '#2c44c9',
    lang: 'en-CA',
    categories: ['business', 'education', 'music'],
    icons: [
      { src: url('icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: url('icons/icon.svg'), sizes: 'any', type: 'image/svg+xml' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
};
