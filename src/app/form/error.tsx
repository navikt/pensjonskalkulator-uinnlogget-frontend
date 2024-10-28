'use client'

import {
  BodyShort,
  Box,
  Button,
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
            <VStack gap="12" align="start">
              <div>
                <BodyShort textColor="subtle" size="small">
                  Statuskode {error.status}
                </BodyShort>
                <Heading level="1" size="large" spacing>
                  Beklager, noe gikk galt.
                </Heading>
                {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
                <BodyShort spacing>
                  En teknisk feil på våre servere gjør at siden er
                  utilgjengelig. Dette skyldes ikke noe du gjorde.
                </BodyShort>
                <BodyShort>Du kan prøve å</BodyShort>
                <List>
                  <List.Item>
                    vente noen minutter og{' '}
                    {/* Husk at POST-data går tapt når man reloader med JS. For å unngå dette kan dere
                        fjerne lenken (men beholde teksten) slik at man må bruke nettleserens reload-knapp. */}
                    <Link href="#" onClick={() => location.reload()}>
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
                <BodyShort>
                  Hvis problemet vedvarer, kan du{' '}
                  {/* https://nav.no/kontaktoss for eksterne flater */}
                  <Link href="#" target="_blank">
                    kontakte oss (åpnes i ny fane)
                  </Link>
                  .
                </BodyShort>
              </div>

              <BodyShort size="small" textColor="subtle">
                Feil-id: 12345678-9123-4567-8912-345678912345
              </BodyShort>

              <Button>Gå til Min side</Button>
            </VStack>
            <div>
              <Heading level="1" size="large" spacing>
                Something went wrong
              </Heading>
              <BodyShort spacing>
                This was caused by a technical fault on our servers. Please
                refresh this page or try again in a few minutes.{' '}
              </BodyShort>
              <BodyShort>
                {/* https://www.nav.no/kontaktoss/en for eksterne flater */}
                <Link target="_blank" href="#">
                  Contact us (opens in new tab)
                </Link>{' '}
                if the problem persists.
              </BodyShort>
            </div>
          </VStack>
        </HGrid>
      </Box>
    </Page.Block>
  )
}