import React, {
  forwardRef,
  ReactElement,
  Suspense,
  use,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import FormWrapper from '../FormWrapper'
import { Box, Button, Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import { PlusCircleIcon } from '@navikt/aksel-icons'

import { getGrunnbelop } from '@/functions/functions'
import Substep from '../Substep'

interface FormPageProps {
  grunnbelop: number
}

const InntektStep = forwardRef<StepRef, FormPageProps>(
  ({ grunnbelop }, ref) => {
    const { states, setState } = useContext(FormContext) as ContextForm
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [inputArray, setInputArray] = useState<ReactElement[]>([])

    const ektefelleText = `Har du ektefelle, partner eller samboer som har inntekt større enn ${
      2 * grunnbelop
    }kr når du starter å ta ut pensjon?`

    const addInputField = () => {
      return (
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
          key={inputArray.length}
        />
      )
    }

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
          {inputArray.map((input) => input)}
          <Button
            onClick={() => setInputArray((prev) => [...prev, addInputField()])}
            icon={<PlusCircleIcon />}
            variant='tertiary'
          >
            Legg til
          </Button>
          <Substep>
            <RadioGroup legend={'Har du rett til AFP i privat sektor?'}>
              <Radio value='ja'>Ja</Radio>
              <Radio value='nei'>Nei</Radio>
            </RadioGroup>
          </Substep>
          <Substep>
            <RadioGroup legend={ektefelleText}>
              <Radio value='ja'>Ja</Radio>
              <Radio value='nei'>Nei</Radio>
            </RadioGroup>
          </Substep>
          <Substep>
            <RadioGroup
              legend={
                'Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?'
              }
            >
              <Radio value='ja'>Ja</Radio>
              <Radio value='nei'>Nei</Radio>
            </RadioGroup>
          </Substep>
        </div>
      </FormWrapper>
    )
  }
)

InntektStep.displayName = 'InntektStep'
export default InntektStep
