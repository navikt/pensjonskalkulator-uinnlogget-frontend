import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@navikt/ds-react'

export default function Home() {
  return (
    <main className={styles.main}>
      <Button>Send</Button>
      <Button>Send</Button>
      <Button>Send</Button>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta officia
        tempora minima nulla natus molestias recusandae ipsa distinctio eius
        corrupti!
      </p>
    </main>
  )
}
