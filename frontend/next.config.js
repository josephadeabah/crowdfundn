/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    domains: ['pbs.twimg.com', 'images.pexels.com', 'plus.unsplash.com'],
  },
};

export default nextConfig;
