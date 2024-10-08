import { VStack } from '@navikt/ds-react'
import React, { FormEvent, ReactNode } from 'react'

interface FormWrapperProps {
  children: ReactNode
  onSubmit: () => void
}

function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <VStack gap={'4'} paddingBlock={'3'}>
      <form onSubmit={handleOnSubmit}>{children}</form>
    </VStack>
  )
}

export default FormWrapper
