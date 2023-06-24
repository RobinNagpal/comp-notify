/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: ['api.multiavatar.com', 'tailwindui.com', 'd31h13bdjwgzxs.cloudfront.net'],
  },
  env: {
  },
}

module.exports = nextConfig
