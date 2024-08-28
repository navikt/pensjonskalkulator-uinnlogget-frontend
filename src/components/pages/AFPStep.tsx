import React, { forwardRef, useContext, useImperativeHandle } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import Substep from '../Substep'

interface FormPageProps {
  grunnbelop: number
}

const AFPStep = forwardRef<StepRef, FormPageProps>(({ grunnbelop }, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const message = 'Du må svare på spørsmålet';

  useImperativeHandle(ref, () => ({
    onSubmit() {

      if(!states.rettTilAfp) {
        setErrorMsg(message);
        return false;
      }

      return true;
    }
  }))

  return (
    <FormWrapper>
      <Substep>
        <RadioGroup legend={'Har du rett til AFP i privat sektor?'}
        value={states.rettTilAfp}
        onChange={(it) =>
          setState((prev: FormValues) => ({
            ...prev,
            rettTilAfp: it,
          }))
        }
        error={errorMsg}
        >
          <Radio value='ALDERSPENSJON_MED_AFP_PRIVAT'>Ja</Radio>
          <Radio value='ALDERSPENSJON'>Nei</Radio>
        </RadioGroup>
      </Substep>
    </FormWrapper>
  )
})

AFPStep.displayName = 'AFPStep'
export default AFPStep
