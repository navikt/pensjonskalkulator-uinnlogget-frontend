import '@navikt/ds-css'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'

import './globals.css'

const decoratorEnv = (process.env.DECORATOR_ENV ?? 'prod') as 'dev' | 'prod'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const Decorator = await fetchDecoratorReact({
    env: decoratorEnv,
    params: { context: 'privatperson' },
  })

  return (
    <html lang="no">
      <head>
        <title>Start - Uinnlogget pensjonskalkulator</title>
        <Decorator.HeadAssets />
      </head>
      <link
        rel="preload"
        href="https://cdn.nav.no/aksel/@navikt/ds-css/2.9.0/index.min.css"
        as="style"
      ></link>
      <body>
        <Decorator.Header />
        <main id="maincontent" tabIndex={-1}>
          {children}
        </main>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  )
}
