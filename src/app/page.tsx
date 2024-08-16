import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@navikt/ds-react'

// import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'

import QuestionPage from '@/components/QuestionPage'
import { mockQuestions } from '@/components/mockQuestions'

export default function Home() {
  return (
    <>
      <main>
        {/* <Loader /> */}
        <QuestionPage questions={mockQuestions} />
      </main>
    </>
  )
}
