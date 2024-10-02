import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@navikt/ds-css'
import { fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const decoratorEnv = (process.env.DECORATOR_ENV ?? 'prod') as 'dev' | 'prod'

export const metadata: Metadata = {
  title: 'Forenklet Pensjonskalkulator',
  description: 'Her kan du regne ut pensjon din'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const fragments = await fetchDecoratorHtml({
    env: decoratorEnv,
    params: { context: 'privatperson' }
  })

  
  const {
    DECORATOR_STYLES,
    DECORATOR_SCRIPTS,
    DECORATOR_HEADER,
    DECORATOR_FOOTER
  } = fragments

  return (
    <html lang='nb'>
      <head
        dangerouslySetInnerHTML={{ __html: DECORATOR_STYLES }}
        suppressHydrationWarning
      />
      <body>
        <div
          dangerouslySetInnerHTML={{
            __html: DECORATOR_HEADER
          }}
          suppressHydrationWarning
        />
        {children}
        <div
          dangerouslySetInnerHTML={{ __html: DECORATOR_FOOTER }}
          suppressHydrationWarning
        />
        <div dangerouslySetInnerHTML={{ __html: DECORATOR_SCRIPTS }} />
      </body>
    </html>
  )
}
