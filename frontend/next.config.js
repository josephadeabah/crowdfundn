/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    domains: [
      'pbs.twimg.com',
      'images.pexels.com',
      'plus.unsplash.com',
      'bantuhive-space-media.nyc3.digitaloceanspaces.com',
    ],
  },
};

export default nextConfig;
