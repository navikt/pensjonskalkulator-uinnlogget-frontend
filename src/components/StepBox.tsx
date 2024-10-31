import { Box, Button, HStack } from '@navikt/ds-react'
import React from 'react'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function StepBox({ children }: LayoutProps) {
  return (
    <Box
      padding={'8'}
      width={'full'}
      background="surface-subtle"
      data-testid="outer-box"
    >
      <div className="flex items-center w-full">
        <div className="mx-auto">
          <h2 className=" mb-3">Pensjonskalkulator</h2>
          <Box
            marginBlock={'auto'}
            width={'fit-content'}
            padding={'4'}
            background="bg-default"
            data-testid="inner-box"
          >
            {children}
            <HStack gap={'2'}>
              <Button variant="primary">Neste</Button>
              <Button variant="tertiary">Forrige</Button>
            </HStack>
          </Box>
        </div>
      </div>
    </Box>
  )
}

export default StepBox
