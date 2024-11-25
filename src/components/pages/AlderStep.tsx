import React, { useContext } from 'react'
import { Box, TextField } from '@navikt/ds-react'
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
    <FormWrapper onSubmit={onSubmit}>
      <Box maxWidth={{ md: '30%', sm: '8rem' }}>
        <TextField
          className={stepStyles.textfieldAar}
          style={{ width: '6rem' }}
          onChange={(it) =>
            handleFieldChange((draft) => {
              const value = parseInt(it.target.value)
              draft.foedselAar = isNaN(value) ? null : value
            }, 'foedselAar')
          }
          inputMode="numeric"
          label="I hvilket år er du født?"
          value={state.foedselAar ?? ''}
          error={errorFields.foedselAar}
        ></TextField>
      </Box>
      <Substep>
        <TextField
          className={stepStyles.textfieldAar}
          onChange={(it) =>
            handleFieldChange((draft) => {
              const value = parseInt(it.target.value)
              draft.inntektOver1GAntallAar = isNaN(value) ? undefined : value
            }, 'inntektOver1GAntallAar')
          }
          inputMode="numeric"
          label="Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?"
          value={state.inntektOver1GAntallAar ?? ''}
          error={errorFields.inntektOver1GAntallAar}
        ></TextField>
      </Substep>
      <FormButtons />
    </FormWrapper>
  )
}

export default AlderStep
