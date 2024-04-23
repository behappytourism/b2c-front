/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-server-i1.mytravellerschoice.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "file-cdn.mytravellerschoice.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tctt.b-cdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8189",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-server-i.behappytourism.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
