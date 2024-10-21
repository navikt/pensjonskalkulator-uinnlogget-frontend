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
            maxLength={3}
            onChange={(it) =>
              handleFieldChange((draft) => {
                draft.foedselAar =
                  it.target.value === '' ? 0 : parseInt(it.target.value, 10)
              }, 'foedselAar')
            }
            type="number"
            inputMode="numeric"
            label="I hvilket år er du født?"
            value={state.foedselAar === 0 ? '' : state.foedselAar}
            error={errorFields.foedselAar}
          ></TextField>
        </Box>
        <Substep>
          <Box maxWidth={{ md: '30%', sm: '8rem' }}>
            <TextField
              maxLength={3}
              onChange={(it) =>
                handleFieldChange((draft) => {
                  draft.inntektOver1GAntallAar =
                    it.target.value === '' ? 0 : parseInt(it.target.value, 10)
                }, 'inntektOver1GAntallAar')
              }
              type="number"
              inputMode="numeric"
              label="Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?"
              value={
                state.inntektOver1GAntallAar === 0
                  ? ''
                  : state.inntektOver1GAntallAar
              }
              error={errorFields.inntektOver1GAntallAar}
            ></TextField>
          </Box>
        </Substep>
        <FormButtons />
      </FormWrapper>
    </>
  )
}

export default AlderStep
