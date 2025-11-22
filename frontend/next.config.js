/** @type {import('next').NextConfig} */
const nextConfig = {
  // 圖片優化設定
  images: {
    domains: ['cdn.waterballsa.tw', 'lh3.googleusercontent.com', 'world.waterballsa.tw', 'api.dicebear.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.waterballsa.tw',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'world.waterballsa.tw',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },

  // Docker 部署優化：使用 standalone 輸出模式
  // 大幅減少部署映像檔大小（僅包含必要檔案）
  output: 'standalone',

  // 禁用 X-Powered-By header（安全性考量）
  poweredByHeader: false,

  // 壓縮設定
  compress: true,

  // React Strict Mode（開發時建議啟用）
  reactStrictMode: true,

  // SWC Minification（效能優化）
  swcMinify: true,
}

module.exports = nextConfig
