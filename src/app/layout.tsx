import Script from 'next/script'

import '@navikt/ds-css'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'

import ErrorHandler from '@/components/ErrorHandler'

const decoratorEnv = (
  process.env.NEXT_PUBLIC_ENV === 'production' ? 'prod' : 'dev'
) as 'dev' | 'prod'

// * Check if we're in development mode to apply specific configurations
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_ENV === 'development'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const Decorator = await fetchDecoratorReact({
    env: decoratorEnv,
    params: {
      context: 'privatperson',
      // * Try to minimize analytics initialization in development
      ...(isDevelopment && {
        maskHotjar: true,
        chatbot: false,
        feedback: false,
      }),
    },
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
        <ErrorHandler />
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
