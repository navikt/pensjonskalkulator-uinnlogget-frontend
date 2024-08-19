import { Box, Button, HStack, Link, TextField, VStack } from '@navikt/ds-react'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'

export default function QuestionBox() {
  return (
    <Box padding={'8'} width={'full'} background='surface-subtle'>
      <div className='flex flex-col items-center w-full'>
        {/* <div className='mx-auto'> */}
        <h2 className='ml-0 mb-3'>Pensjonskalkulator</h2>
        <Box
          marginBlock={'auto'}
          width={'40rem'}
          padding={'4'}
          background='bg-default'
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
              <Button variant='primary'>
                <Link
                  href='./kalkulator-uinnlogget/form'
                  className='text-white'
                >
                  <p className=' text-white'>Kom i Gang</p>
                </Link>
              </Button>
              <Button variant='tertiary'>Avbryt</Button>
            </HStack>
            <Link href='https://staging.ekstern.dev.nav.no/pensjon/kalkulator/start#:~:text=Personopplysninger%20som%20brukes%20i%20pensjonskalkulator'>
              Personopplysninger som brukes i pensjonskalkulator
            </Link>
          </VStack>
        </Box>
      </div>
      {/* </div> */}
    </Box>
  )
}
