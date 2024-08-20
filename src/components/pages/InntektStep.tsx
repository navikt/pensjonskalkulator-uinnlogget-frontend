import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import FormWrapper from '../FormWrapper'
import { Box, Button, TextField } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import { PlusCircleIcon } from '@navikt/aksel-icons'

const InntektStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputArray = []

  useImperativeHandle(ref, () => ({
    onSubmit() {
      if (!states.inntekt) {
        setErrorMsg('Du må fylle ut inntekt')
        return false
      }

      // Must not be negative
      if (parseInt(states.inntekt) < 0) {
        setErrorMsg('Inntekt kan ikke være negativ')
        return false
      }

      return true
    }
  }))

  return (
    <FormWrapper>
      <h2>Hva er din forventet inntekt?</h2>
      <div className='w-30'>
        <TextField
          onChange={(it) =>
            setState((prev: FormValues) => ({
              ...prev,
              inntekt: it.target.value
            }))
          }
          label='Inntekt'
          value={states.inntekt || ''}
          error={errorMsg}
        />
        <Button icon={<PlusCircleIcon />} variant='tertiary'>
          Legg til
        </Button>
      </div>
    </FormWrapper>
  )
})

InntektStep.displayName = 'InntektStep'
export default InntektStep
