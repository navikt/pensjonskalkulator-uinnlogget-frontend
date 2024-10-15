import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues } from '@/common'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'

const AFPStep = () => {
  const { states, setState, formPageProps } = useContext(
    FormContext
  ) as ContextForm

  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const { handleFieldChange } = useFieldChange<FormValues>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('AFPStep')
    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }

    return false
  }

  return (
    <FormWrapper onSubmit={onSubmit}>
      <Substep>
        <RadioGroup
          legend={'Har du rett til AFP i privat sektor?'}
          value={states.simuleringType}
          onChange={(it) =>
            handleFieldChange((draft) => {
              draft.simuleringType = it
            }, 'simuleringType')
          }
          error={errorFields.simuleringType}
        >
          <Radio value="ALDERSPENSJON_MED_AFP_PRIVAT">Ja</Radio>
          <Radio value="ALDERSPENSJON">Nei</Radio>
        </RadioGroup>
      </Substep>
      <FormButtons />
    </FormWrapper>
  )
}

export default AFPStep
