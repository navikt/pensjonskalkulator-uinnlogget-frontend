import React from 'react'
import StepBox from '../StepBox'
import { TextField, VStack } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'

function AlderStep() {
  return (
    <>
      <FormWrapper>
        <div>Hva er din alder</div>
        <div className='w-24'>
          <TextField type='number' label='Alder'></TextField>
        </div>
      </FormWrapper>
    </>
  )
}

export default AlderStep
