/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  basePath: '/pensjon/uinnlogget-kalkulator',
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  reactStrictMode: true,
  images: {
    domains: ['www.nav.no'],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
