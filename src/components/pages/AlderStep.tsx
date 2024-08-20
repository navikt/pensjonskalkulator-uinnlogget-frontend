import React, {
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import StepBox from '../StepBox'
import { TextField, VStack } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'

import addState from '@/helpers/addState'
import { ContextForm, StepRef } from '@/common'
import { FormContext } from '@/contexts/context'

const AlderStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const message = 'Du må sette en alder mellom 16 og 75'

  useImperativeHandle(ref, () => ({
    onSubmit() {
      if (!states.alder?.state) {
        setErrorMsg(message);
        return false
      }

      // Age must be between 16 and 75
      if (
        parseInt(states.alder.state) < 16 ||
        parseInt(states.alder.state) > 75
      ) {
        setErrorMsg(message);
        return false
      }

      return true
    }
  }))

  return (
    <>
      <FormWrapper>
        <h2>Hva er din alder?</h2>
        <p>
          Hvor gammel er du? Dette er viktig for å beregne pensjonen din.
        </p>
        <div className='w-24'>
          <TextField
            onChange={(it) => addState(it.target.value, setState, 'alder')}
            type='number'
            label='Alder'
            value={states.alder?.state || ''}
            error={errorMsg}
          ></TextField>
        </div>
      </FormWrapper>
    </>
  )
})

export default AlderStep
