import { ContextForm, FormPageProps } from '@/common'
import { FormContext } from '@/contexts/context'
import { Button, HStack } from '@navikt/ds-react'
import React, { useContext } from 'react'

interface Props {
  onSubmit?: () => void
}

function FormButtons({ onSubmit }: Props) {
  const context = useContext(FormContext) as ContextForm

  const { curStep, onStepChange, length, back } = context.formPageProps

  return (
    <HStack gap={'2'} marginBlock="2">
      <Button type="submit" variant="primary">
        {curStep === length! - 1 ? 'Send' : 'Neste'}
      </Button>

      {curStep !== 0 && (
        <Button type="button" variant="secondary" onClick={back}>
          Tilbake
        </Button>
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={() => onStepChange!(length! - 1)}
      >
        Til slutt
      </Button>
    </HStack>
  )
}

export default FormButtons
