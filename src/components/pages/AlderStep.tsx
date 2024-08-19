import React, { useContext } from 'react'
import StepBox from '../StepBox'
import { TextField, VStack } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'

import addState from '@/helpers/addState'
import { ContextForm } from '@/common'
import { FormContext } from '@/contexts/context'

function AlderStep() {
  const { states, setState } = useContext(FormContext) as ContextForm

  return (
    <>
      <FormWrapper>
        <div>Hva er din alder</div>
        <div className='w-24'>
          <TextField
            onChange={(it) => addState(it.target.value, setState, 'alder')}
            type='number'
            label='Alder'
            value={states.alder?.state || ''}
          ></TextField>
        </div>
      </FormWrapper>
    </>
  )
}

export default AlderStep
