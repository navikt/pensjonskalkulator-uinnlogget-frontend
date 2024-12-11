import { FormContext } from '@/contexts/context'
import { Button, HStack } from '@navikt/ds-react'
import React, { useContext } from 'react'

function FormButtons() {
  const context = useContext(FormContext)

  const { curStep, length, goBack } = context.formPageProps

  return (
    <HStack gap={'2'} marginBlock="2">
      <Button type="submit" variant="primary">
        {curStep === length - 1 ? 'Beregn' : 'Neste'}
      </Button>

      {curStep !== 0 && (
        <Button type="button" variant="secondary" onClick={goBack}>
          Tilbake
        </Button>
      )}
    </HStack>
  )
}

export default FormButtons
