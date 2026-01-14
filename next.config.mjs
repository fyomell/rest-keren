/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,       // <--- INI OBATNYA (Matikan SWC)
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true, // Biar gak rewel soal linting
  },
};

export default nextConfig;
