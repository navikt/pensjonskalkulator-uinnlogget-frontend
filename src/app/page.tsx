import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@navikt/ds-react'

export default function Home() {
  return (
    <main className={styles.main}>
      <Button>Send</Button>
    </main>
  )
}
