/** @type {import('next').NextConfig} */
const nextConfig = {
  // 在这里添加 images 的配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;