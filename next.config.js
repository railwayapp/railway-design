/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Next.js 14 only loads instrumentation.ts behind this flag.
    instrumentationHook: true,
  },
}

module.exports = nextConfig

