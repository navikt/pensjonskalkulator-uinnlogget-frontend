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
  const [errorFields, setErrorFields] = React.useState({
    rettTilAfp: false,
    tredjepersonStorreEnn2G: false,
    tredjepersonMottarPensjon: false,
  })
  const message = 'Du må svare på spørsmålet';

  useImperativeHandle(ref, () => ({
    onSubmit() {
      const errors = {
        rettTilAfp: !states.rettTilAfp,
        tredjepersonStorreEnn2G: !states.tredjepersonStorreEnn2G,
        tredjepersonMottarPensjon: !states.tredjepersonMottarPensjon,
      };

      setErrorFields(errors);

      if(Object.values(errors).some((error) => error)) {
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
        error={errorFields.rettTilAfp ? message : ''}
        >
          <Radio value='ja'>Ja</Radio>
          <Radio value='nei'>Nei</Radio>
        </RadioGroup>
      </Substep>
      <Substep>
        <RadioGroup
          legend={`Har du ektefelle, partner eller samboer som har inntekt større enn ${
            2 * grunnbelop
          }kr når du starter å ta ut pensjon?`}
          value={states.tredjepersonStorreEnn2G}
          onChange={(it) =>
            setState((prev: FormValues) => ({
              ...prev,
              tredjepersonStorreEnn2G: it,
            }))
          }
          error={errorFields.tredjepersonStorreEnn2G ? message : ''}
        >
          <Radio value='ja'>Ja</Radio>
          <Radio value='nei'>Nei</Radio>
        </RadioGroup>
      </Substep>
      <Substep>
        <RadioGroup
          legend={
            'Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?'
          }
          value={states.tredjepersonMottarPensjon}
          onChange={(it) =>
            setState((prev: FormValues) => ({
              ...prev,
              tredjepersonMottarPensjon: it,
            }))
          }
          error={errorFields.tredjepersonMottarPensjon ? message : ''}
        >
          <Radio value='ja'>Ja</Radio>
          <Radio value='nei'>Nei</Radio>
        </RadioGroup>
      </Substep>
    </FormWrapper>
  )
})

AFPStep.displayName = 'AFPStep'
export default AFPStep
