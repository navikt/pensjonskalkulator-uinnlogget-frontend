'use client'

import { useEffect } from 'react'

import {
  BodyShort,
  Box,
  Button,
  HGrid,
  Heading,
  Page,
  VStack,
} from '@navikt/ds-react'

import { logger } from '@/components/utils/logging'
import Link from 'next/link'

export default function Error() {
  useEffect(() => {
    logger('feilside', { feil: 'Uventet feil' })
  }, [])

  return (
    <Page.Block as="main" width="xl" gutters>
      <Box paddingBlock="20 8">
        <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
          <VStack gap="16">
            <VStack gap="3" align="start">
              <Heading level="1" size="large" spacing>
                Oops! Det har oppstått en uventet feil.
              </Heading>
              <BodyShort spacing>
                Vi jobber med å rette feilen. Prøv igjen senere.
              </BodyShort>
              <Link href="/">
                <Button variant="primary">Avbryt</Button>
              </Link>
            </VStack>
          </VStack>
        </HGrid>
      </Box>
    </Page.Block>
  )
}
