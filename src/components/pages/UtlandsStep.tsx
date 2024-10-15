import React, { useContext } from 'react'
import { Radio, RadioGroup, ReadMore, TextField } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'

const UtlandsStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('UtlandsStep')
    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }
    return false
  }

  return (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <h2>Utland</h2>
        <div>
          <RadioGroup
            legend="Har du bodd eller arbeidet utenfor Norge?"
            value={state.boddIUtland}
            onChange={(it) =>
              handleFieldChange((draft) => {
                draft.boddIUtland = it
              }, 'boddIUtland')
            }
            error={errorFields.boddIUtland}
          >
            <Radio value={'ja'}>Ja</Radio>
            <Radio value={'nei'}>Nei</Radio>
          </RadioGroup>
          <ReadMore header="Om opphold utenfor Norge">
            Hvis du har bodd eller arbeidet utenfor Norge, kan det påvirke
            pensjonen din. Hvis du har bodd i utlandet, kan du ha rett til
            pensjon fra det landet du har bodd i.
          </ReadMore>
          {state.boddIUtland === 'ja' && (
            <Substep>
              <TextField
                onChange={(it) =>
                  handleFieldChange((draft) => {
                    draft.utenlandsAntallAar =
                      it.target.value === '' ? 0 : parseInt(it.target.value, 10)
                  }, 'utenlandsAntallAar')
                }
                type="number"
                inputMode="numeric"
                label="Hvor mange år har du bodd i utlandet?"
                value={
                  state.utenlandsAntallAar === 0 ? '' : state.utenlandsAntallAar
                }
                error={errorFields.utenlandsAntallAar}
              ></TextField>
            </Substep>
          )}
        </div>
        <FormButtons />
      </FormWrapper>
    </>
  )
}

export default UtlandsStep
