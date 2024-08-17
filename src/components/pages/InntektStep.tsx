import React, { useState } from 'react'
import FormWrapper from '../FormWrapper'
import { TextField } from '@navikt/ds-react'

function InntektStep() {
  const [val, setVal] = useState<string | number>('')

  return (
    <FormWrapper>
      <div>Hva er din forventet inntekt?</div>
      <TextField
        onChange={(val) => setVal(val.target.value)}
        label='Inntekt'
        value={val}
      />
    </FormWrapper>
  )
}

export default InntektStep
