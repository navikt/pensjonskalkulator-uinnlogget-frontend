import { Box, Button, HStack, Link, VStack } from '@navikt/ds-react'
import React, { ChildContextProvider } from 'react'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function StepBox({ children }: LayoutProps) {
  return (
    <Box padding={'8'} width={'full'} background='surface-subtle'>
      <div className='flex items-center w-full'>
        <div className='mx-auto'>
          <h2 className=' mb-3'>Pensjonskalkulator</h2>
          <Box
            marginBlock={'auto'}
            width={'fit-content'}
            padding={'4'}
            background='bg-default'
          >
            {children}
            <HStack gap={'2'}>
              <Button variant='primary'>Neste</Button>
              <Button variant='tertiary'>Forrige</Button>
            </HStack>
            <Link href='https://staging.ekstern.dev.nav.no/pensjon/kalkulator/start#:~:text=Personopplysninger%20som%20brukes%20i%20pensjonskalkulator'>
              Personopplysninger som brukes i pensjonskalkulator
            </Link>
          </Box>
        </div>
      </div>
    </Box>
  )
}

export default StepBox
