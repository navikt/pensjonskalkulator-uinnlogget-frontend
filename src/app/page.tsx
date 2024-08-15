import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@navikt/ds-react'

import { Metadata } from 'next'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Head from 'next/head'
import QuestionPage from '@/components/QuestionPage'
import { mockQuestions } from '@/components/mockQuestions'

export default async function Home() {
  const Decorator = await fetchDecoratorReact({
    env: 'dev',
    params: { context: 'arbeidsgiver', simple: true }
  } as any)
  return (
    <>
      <Decorator.Styles />
      <main>
        <Decorator.Header />
        <QuestionPage questions={mockQuestions} />
        <Decorator.Footer />
      </main>
    </>
  )
}
