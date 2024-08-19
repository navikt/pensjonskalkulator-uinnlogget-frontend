import React from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'

function AFPStep() {
  return (
    <FormWrapper>
      <p>Har du rett til AFP i privat sektor?</p>
      <RadioGroup legend=''>
        <Radio value={'ja'}>Ja</Radio>
        <Radio value={'nei'}>Nei</Radio>
      </RadioGroup>
    </FormWrapper>
  )
}

export default AFPStep
