import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Allow Cloudinary images
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Allow placeholders
      },
    ],
  },
};

export default nextConfig;