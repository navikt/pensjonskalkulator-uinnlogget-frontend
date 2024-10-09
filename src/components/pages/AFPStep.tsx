import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues } from '@/common'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'

const AFPStep = () => {
  const { states, setState, formPageProps } = useContext(
    FormContext
  ) as ContextForm

  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const handleFieldChange = (field: keyof FormValues, value: string | null) => {
    setState((prev: FormValues) => ({
      ...prev,
      [field]: value,
    }))
    clearError(field)
  }

  // useImperativeHandle(ref, () => ({
  //   onSubmit() {
  //     const hasErrors = validateFields('AFPStep')
  //     if (!hasErrors) return true
  //     return false
  //   },
  // }))

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
          onChange={(it) => handleFieldChange('simuleringType', it)}
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
