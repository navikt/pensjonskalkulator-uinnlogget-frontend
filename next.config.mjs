/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/pensjon/uinnlogget-kalkulator',
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  output: 'standalone',
}

export default nextConfig
