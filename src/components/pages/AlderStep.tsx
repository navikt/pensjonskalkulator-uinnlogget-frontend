import React, { useContext } from 'react'
import { Heading, TextField } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import Substep from '../Substep'
import { useFieldChange } from '@/helpers/useFormState'
import stepStyles from '../styles/stepStyles.module.css'
import { logger } from '../utils/logging'

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
    logger('button klikk', { tekst: 'Neste fra Alder og yrkesaktivitet' })
    formPageProps.goToNext()
    return true
  }

  return (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <Heading level="2" size="medium" className={stepStyles.underOverskrift}>
          Alder og yrkesaktivitet
        </Heading>
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
            label="Hvor mange år har du jobbet i Norge når du tar ut pensjon?"
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
