'use client'

import { Box, Button, HStack } from '@navikt/ds-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ErrorPagesButtons() {
  const [error, setError] = useState(false)
  if (error) {
    throw new Error('Feil fra ErrorPagesButtons')
  }

  return (
    <>
      <HStack width={'100'}>
        <Box marginInline={'auto'} width={'fill'}>
          <HStack gap={'2'}>
            <Button
              onClick={() => {
                setError(true)
              }}
            >
              Vis feilmelding side
            </Button>
            <Link href="/404">
              <Button>Vis 404 side</Button>
            </Link>
          </HStack>
        </Box>
      </HStack>
    </>
  )
}
