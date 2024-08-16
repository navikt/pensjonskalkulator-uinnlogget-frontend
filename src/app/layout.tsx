import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@navikt/ds-css'
import { fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr'
import { extractScripts } from '@/helpers/Scriptextractor'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

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
    env: 'prod', // or "dev" depending on your environment
    params: { context: 'privatperson' }
  })

  const {
    DECORATOR_STYLES,
    DECORATOR_SCRIPTS,
    DECORATOR_HEADER,
    DECORATOR_FOOTER
  } = fragments
  const scripts = extractScripts(DECORATOR_SCRIPTS)
  console.log(DECORATOR_SCRIPTS)
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
