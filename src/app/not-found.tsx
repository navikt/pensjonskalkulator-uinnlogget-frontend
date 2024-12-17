'use client'

import { Box, Heading, Link, List, Page, VStack } from '@navikt/ds-react'

const NotFoundPage = () => {
  return (
    <Page>
      <Page.Block as="main" width="xl" gutters>
        <Box paddingBlock="20 16" data-aksel-template="404-v2">
          <VStack gap="16">
            <VStack gap="12" align="start">
              <div>
                <Heading level="1" size="large" spacing>
                  Oops! Siden du leter etter finnes ikke.
                </Heading>
                <List>
                  <List.Item>
                    Hvis du skrev inn adressen direkte i nettleseren kan du
                    sjekke om den er stavet riktig.
                  </List.Item>

                  <List.Item>
                    Hvis du klikket på en lenke er den feil eller utdatert.
                  </List.Item>
                </List>
                <VStack gap="4">
                  <Link href="/pensjon/uinnlogget-kalkulator">
                    Gå til uinnlogget pensjonskalkulator
                  </Link>
                  <Link href="https://www.nav.no/pensjon">Les om pensjon</Link>
                </VStack>
              </div>
            </VStack>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  )
}

export default NotFoundPage
