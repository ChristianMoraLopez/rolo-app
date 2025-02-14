import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'media.discordapp.net',
      'www.pexels.com',
      'images.pexels.com',
      'via.placeholder.com',
      'instagram.fbog7-1.fna.fbcdn.net',
      'previews.dropbox.com'
    ],
  },
  // Mueve appDir fuera de experimental
  appDir: true,
  experimental: {
    // Otras configuraciones experimentales (si las tienes)
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;