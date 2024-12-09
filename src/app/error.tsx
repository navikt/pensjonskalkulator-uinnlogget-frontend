'use client'

import {
  BodyShort,
  Box,
  HGrid,
  Heading,
  Link,
  List,
  Page,
  VStack,
} from '@navikt/ds-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: { message: string; status: number } & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error.status)
  }, [error])
  return (
    <Page.Block as="main" width="xl" gutters>
      <Box paddingBlock="20 8">
        <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
          <VStack gap="16">
            <VStack gap="3" align="start">
              <BodyShort textColor="subtle" size="small">
                Statuskode {error.status}
              </BodyShort>
              <Heading level="1" size="large" spacing>
                Beklager, noe gikk galt.
              </Heading>
              {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
              <BodyShort spacing>
                En teknisk feil på våre servere gjør at siden er utilgjengelig.
                Dette skyldes ikke noe du gjorde.
              </BodyShort>
              <BodyShort>Du kan prøve å</BodyShort>
              <List>
                <List.Item>
                  vente noen minutter og{' '}
                  {/* Husk at POST-data går tapt når man reloader med JS. For å unngå dette kan dere
                        fjerne lenken (men beholde teksten) slik at man må bruke nettleserens reload-knapp. */}
                  <Link onClick={() => location.reload()}>
                    laste siden på nytt
                  </Link>
                </List.Item>
                <List.Item>
                  {/* Vurder å sjekke at window.history.length > 1 før dere rendrer dette som en lenke */}
                  <Link onClick={() => reset()}>
                    gå tilbake til forrige side
                  </Link>
                </List.Item>
              </List>
            </VStack>
          </VStack>
        </HGrid>
      </Box>
    </Page.Block>
  )
}
