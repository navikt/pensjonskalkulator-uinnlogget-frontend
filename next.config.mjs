/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  basePath: '/pensjon/uinnlogget-kalkulator',
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  output: 'standalone',
}

export default nextConfig
