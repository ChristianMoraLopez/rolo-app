/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media.discordapp.net',
      'www.pexels.com',
      'images.pexels.com',
      'via.placeholder.com',
      'instagram.fbog7-1.fna.fbcdn.net',
      'previews.dropbox.com',
      'res.cloudinary.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;