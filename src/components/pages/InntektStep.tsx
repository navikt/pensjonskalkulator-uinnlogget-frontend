import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import FormWrapper from '../FormWrapper'
import { Box, TextField } from '@navikt/ds-react'
import addState from '@/helpers/addState'
import { FormContext } from '@/contexts/context'
import { ContextForm, StepRef } from '@/common'

const InntektStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    onSubmit() {
      if (!states.inntekt?.state) {
        setErrorMsg('Du må fylle ut inntekt')
        return false
      }

      // Must not be negative
      if (parseInt(states.inntekt.state) < 0) {
        setErrorMsg('Inntekt kan ikke være negativ')
        return false
      }

      return true
    }
  }))

  return (
    <FormWrapper>
      <div>Hva er din forventet inntekt?</div>
      <div className='w-24'>
        <TextField
          onChange={(val) => addState(val.target.value, setState, 'inntekt')}
          label='Inntekt'
          value={states.inntekt?.state || ''}
          error={errorMsg}
        />
      </div>
    </FormWrapper>
  )
})

InntektStep.displayName = 'InntektStep'
export default InntektStep
