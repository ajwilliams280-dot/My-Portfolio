import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AltonsWorld',
    short_name: 'AltonsWorld',
    description: 'Photography, Videography, and Music by Alton',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/icon?id=512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon?id=180',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
