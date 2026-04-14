import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LivingMatch',
    short_name: 'LivingMatch',
    description: 'Dein Zuhause, perfekt gematcht.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a09', // stone-950
    theme_color: '#f97316', // orange-500
    icons: [
      {
        src: '/icon-192.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/icon-512.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
