/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 10000000,
    }
  }
  // output: 'export',
}

module.exports = nextConfig
