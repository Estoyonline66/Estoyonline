import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.estoyonline.es" }],
      destination: "https://estoyonline.es/:path*",
      statusCode: 301,
    }];
  },
  // Send complete metadata in <head> for every visitor and crawler, including
  // AI readers that do not execute JavaScript or process streamed metadata.
  htmlLimitedBots: /.*/,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
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
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
    ],
  },
};

export default nextConfig;
