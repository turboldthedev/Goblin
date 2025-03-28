import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pbs.twimg.com", "res.cloudinary.com"], // Add this line
  },
};

export default nextConfig;
