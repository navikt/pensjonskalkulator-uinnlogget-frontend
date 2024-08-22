import React, { forwardRef, useContext, useImperativeHandle } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup, ReadMore } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import Substep from '../Substep'

interface FormPageProps {
  grunnbelop: number
}

const AFPStep = forwardRef<StepRef, FormPageProps>(({ grunnbelop }, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    onSubmit() {
      return true
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
