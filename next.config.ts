/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'newsapi.org',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // Optional for some articles
      },
    ],
  },
}

module.exports = nextConfig
