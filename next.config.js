/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ordinals.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.ordinalswallet.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;