const { i18n } = require('./next-i18next.config');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'plus.unsplash.com', "ap-southeast-1-ddfe-dev-app.s3.ap-southeast-1.amazonaws.com", "media.istockphoto.com", "play-lh.googleusercontent.com", "upload.wikimedia.org", "news.khangz.com", "ap-southeast-1-sheshi-dev-app.s3.ap-southeast-1.amazonaws.com"],
    unoptimized: true,
  },
  i18n,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'images.unsplash.com',
  //       port: '',
  //       pathname: '/**',
  //     },
  //   ],
  // },
  async headers() {
    return [
      {
        source: '/san-pham/slug',
        headers: [
          {
            key: '/',
            value: '404',
          },
        ],
      },
    ]
  },
  distDir: 'build',
  // output: 'export',//tried with and without the output attribute
  trailingSlash: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.my-file$/i,
      loader: "raw-loader",
    });

    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig