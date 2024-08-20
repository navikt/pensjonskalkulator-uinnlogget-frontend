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

import { ContextForm, FormValues, StepRef } from '@/common'
import { FormContext } from '@/contexts/context'

const AlderStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const message = 'Du må sette en alder mellom 16 og 75'

  const { alder } = states

  useImperativeHandle(ref, () => ({
    onSubmit() {
      if (!alder) {
        setErrorMsg(message)
        return false
      }

      // Age must be between 16 and 75
      if (parseInt(alder) < 16 || parseInt(alder) > 75) {
        setErrorMsg(message)
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
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                alder: it.target.value
              }))
            }
            type='number'
            label='Alder'
            value={alder}
            error={errorMsg}
          ></TextField>
        </div>
        <div></div>
      </FormWrapper>
    </>
  )
})

AlderStep.displayName = 'AlderStep'
export default AlderStep
