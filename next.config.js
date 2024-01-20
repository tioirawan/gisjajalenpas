/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 10000000,
    },
    serverComponentsExternalPackages: ['bcrypt'],
  }
  // output: 'export',
}

module.exports = nextConfig
