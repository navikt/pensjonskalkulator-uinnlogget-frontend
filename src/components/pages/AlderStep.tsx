import React, { useContext } from 'react'
import { Box, TextField } from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import Substep from '../Substep'
import { useFieldChange } from '@/helpers/useFormState'

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
        <Box maxWidth={{ md: '30%', sm: '8rem' }}>
          <TextField
            style={{ width: '6rem' }}
            onChange={(it) =>
              handleFieldChange((draft) => {
                draft.foedselAar =
                  it.target.value === '' ? null : parseInt(it.target.value)
              }, 'foedselAar')
            }
            type="number"
            inputMode="numeric"
            label="I hvilket år er du født?"
            value={state.foedselAar === null ? '' : state.foedselAar}
            error={errorFields.foedselAar}
          ></TextField>
        </Box>
        <Substep>
          <TextField
            style={{ width: '6rem' }}
            onChange={(it) =>
              handleFieldChange((draft) => {
                draft.inntektOver1GAntallAar =
                  it.target.value === ''
                    ? undefined
                    : parseInt(it.target.value, 10)
              }, 'inntektOver1GAntallAar')
            }
            type="number"
            inputMode="numeric"
            label="Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?"
            value={
              state.inntektOver1GAntallAar === undefined
                ? ''
                : state.inntektOver1GAntallAar
            }
            error={errorFields.inntektOver1GAntallAar}
          ></TextField>
        </Substep>
        <FormButtons />
      </FormWrapper>
    </>
  )
}

export default AlderStep
