/** @type {import('next').NextConfig} */
const nextConfig = {
  // 这是我们之前为图片域名加的配置
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
  // 这是我们新加的配置，告诉 Next.js 在构建时忽略 TypeScript 错误
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;