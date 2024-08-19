import { VStack } from '@navikt/ds-react'
import React, { ReactNode } from 'react'

function FormWrapper({ children }: { children: ReactNode }) {
  return (
    <VStack gap={'4'} paddingBlock={'3'}>
      {children}
    </VStack>
  )
}

export default FormWrapper
