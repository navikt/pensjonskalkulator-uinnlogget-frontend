import React, { useContext } from 'react'
import { TextField } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import Substep from '../Substep'
import { useFieldChange } from '@/helpers/useFormState'
import stepStyles from '../styles/stepStyles.module.css'

const AlderStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('AlderStep')
    if (hasErrors) return false
    formPageProps.goToNext()
    return true
  }

  return (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <h2 className={stepStyles.underOverskrift}>Alder og yrkesaktivitet</h2>
        <TextField
          className={stepStyles.textfieldAar}
          onChange={(it) =>
            handleFieldChange((draft) => {
              const value = it.target.value
              draft.foedselAar = value.length > 0 ? value : null
            }, 'foedselAar')
          }
          inputMode="numeric"
          label="I hvilket år er du født?"
          value={state.foedselAar ?? ''}
          error={errorFields.foedselAar}
        ></TextField>
        <Substep>
          <TextField
            className={stepStyles.textfieldAar}
            onChange={(it) =>
              handleFieldChange((draft) => {
                const value = it.target.value
                draft.inntektOver1GAntallAar = value.length > 0 ? value : null
              }, 'inntektOver1GAntallAar')
            }
            inputMode="numeric"
            label="Hvor mange år har du jobbet i Norge?"
            description="Totalt antall år fra du startet i jobb til du tar ut pensjon"
            value={state.inntektOver1GAntallAar ?? ''}
            error={errorFields.inntektOver1GAntallAar}
          ></TextField>
        </Substep>
        <FormButtons />
      </FormWrapper>
    </>
  )
}

export default AlderStep
