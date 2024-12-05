import { Box, Button, HStack, Link, VStack } from '@navikt/ds-react'
import React from 'react'

export default function QuestionBox() {
  return (
    <Box width={'full'} background="surface-subtle">
      <div className="flex flex-col items-center w-full">
        <h2 className=" mb-3">Pensjonskalkulator</h2>

        <Box
          marginBlock={'auto'}
          width={'100%'}
          maxWidth={'40rem'}
          padding={'4'}
          background="bg-default"
        >
          <VStack padding={'6'} gap={'5'}>
            <h3>Hei Du</h3>
            <p>Velkommen til pensjonskalkulatoren som kan vise deg:</p>
            <div>
              <p>Alderspensjon (NAV)</p>
              <p>AFP (avtalefestet pensjon)</p>
              <p>Pensjonsavtaler</p>
            </div>
            <p>
              For å beregne pensjonen din, må du svare på alle spørsmålene som
              kommer.
            </p>
            <HStack gap={'2'}>
              <Link href="./kalkulator-uinnlogget/form" className="text-white">
                <Button variant="primary">Kom i gang</Button>
              </Link>
              <Button variant="tertiary">Avbryt</Button>
            </HStack>
          </VStack>
        </Box>
      </div>
    </Box>
  )
}
