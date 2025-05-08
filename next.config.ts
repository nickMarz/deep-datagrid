import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'api.dicebear.com',
      port: '',
      pathname: '/7.x/avataaars**',
      search: '',
    }
  ],
};

export default nextConfig;
