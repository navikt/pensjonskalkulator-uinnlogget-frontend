import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm } from '@/common'
import addState from '@/helpers/addState'

function AFPStep() {
  const { states, setState } = useContext(FormContext) as ContextForm

  return (
    <FormWrapper>
      <p>Har du rett til AFP i privat sektor?</p>
      <RadioGroup
        legend=''
        value={states.afp?.state || undefined}
        onChange={(val) => addState(val, setState, 'afp')}
      >
        <Radio value={'ja'}>Ja</Radio>
        <Radio value={'nei'}>Nei</Radio>
      </RadioGroup>
    </FormWrapper>
  )
}

export default AFPStep
