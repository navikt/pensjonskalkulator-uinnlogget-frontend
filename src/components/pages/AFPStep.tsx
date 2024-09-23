import React, { forwardRef, useContext, useImperativeHandle } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import Substep from '../Substep'
import useErrorHandling from './useErrorHandling'

interface FormPageProps {
  grunnbelop: number
}

const AFPStep = forwardRef<StepRef, FormPageProps>(({ grunnbelop }, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const handleFieldChange = (field: keyof FormValues, value: string | null) => {
    setState((prev: FormValues) => ({
      ...prev,
      [field]: value,
    }));
    clearError(field);
  }

  useImperativeHandle(ref, () => ({
    onSubmit() {
      const hasErrors = validateFields("AFPStep");
      if(!hasErrors) return true; 
      return false;
    }
  }))

  return (
    <FormWrapper>
      <Substep>
        <RadioGroup legend={'Har du rett til AFP i privat sektor?'}
        value={states.simuleringType}
        onChange={(it) => handleFieldChange('simuleringType', it)}
        error={errorFields.simuleringType}
        >
          <Radio value='ALDERSPENSJON_MED_AFP_PRIVAT'>Ja</Radio>
          <Radio value='ALDERSPENSJON'>Nei</Radio>
        </RadioGroup>
      </Substep>
    </FormWrapper>
  )
})

AFPStep.displayName = 'AFPStep'
export default AFPStep
