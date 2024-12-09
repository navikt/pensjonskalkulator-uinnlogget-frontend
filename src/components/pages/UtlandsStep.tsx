import React, { useContext } from 'react'
import { Radio, RadioGroup, ReadMore, TextField } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'
import stepStyles from '../styles/stepStyles.module.css'

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
        <h2 className={stepStyles.underOverskrift}>Utland</h2>
        <div>
          <RadioGroup
            legend="Har du bodd eller arbeidet utenfor Norge?"
            value={state.harBoddIUtland}
            onChange={(it: boolean) =>
              handleFieldChange((draft) => {
                if (it === false) {
                  draft.utenlandsAntallAar = undefined
                }
                draft.harBoddIUtland = it
              }, 'harBoddIUtland')
            }
            error={errorFields.harBoddIUtland}
          >
            <Radio value={true}>Ja</Radio>
            <Radio value={false}>Nei</Radio>
          </RadioGroup>
          <ReadMore
            className={stepStyles.componentSpacing}
            header="Om opphold utenfor Norge"
          >
            Hvis du har bodd eller jobbet utenfor Norge, kan det påvirke
            pensjonen din. Hvis du har bodd i utlandet, kan du ha rett til
            pensjon fra det landet du har bodd i.
          </ReadMore>
          {state.harBoddIUtland && (
            <Substep>
              <TextField
                className={stepStyles.textfieldAar}
                onChange={(it) =>
                  handleFieldChange((draft) => {
                    const value = it.target.value
                    draft.utenlandsAntallAar =
                      value.length > 0 ? value : undefined
                  }, 'utenlandsAntallAar')
                }
                inputMode="numeric"
                label="Hvor mange år har du bodd i utlandet?"
                description="Fra du fylte 16 år til du tar ut pensjon"
                value={state.utenlandsAntallAar ?? ''}
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
