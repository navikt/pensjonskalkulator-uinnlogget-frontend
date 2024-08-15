import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@navikt/ds-css'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Head from 'next/head'

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
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
