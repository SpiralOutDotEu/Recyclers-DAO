/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'gateway.lighthouse.storage',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }