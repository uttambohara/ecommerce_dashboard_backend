/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "prgbwpzcwoxdqzqzvhdh.supabase.co",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
