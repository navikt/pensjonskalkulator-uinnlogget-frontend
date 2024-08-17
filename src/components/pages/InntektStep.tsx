import React, { useContext, useState } from 'react'
import FormWrapper from '../FormWrapper'
import { TextField } from '@navikt/ds-react'
import { ContextForm, FormContext } from '@/app/form/page'
import addState from '@/helpers/addState'

function InntektStep() {
  const { states, setState } = useContext(FormContext) as ContextForm

  return (
    <FormWrapper>
      <div>Hva er din forventet inntekt?</div>
      <TextField
        onChange={(val) => addState(val.target.value, setState, 'inntekt')}
        label='Inntekt'
        value={states.inntekt?.state || ''}
      />
    </FormWrapper>
  )
}

export default InntektStep
