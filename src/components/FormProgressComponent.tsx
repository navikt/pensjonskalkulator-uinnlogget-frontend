import React from 'react'
import { FormProgress } from '@navikt/ds-react'

interface FormProgressComponentProps {
  totalSteps: number
  activeStep: number
  onStepChange: (newStep: number) => void
}

const FormProgressComponent: React.FC<FormProgressComponentProps> = ({
  totalSteps,
  activeStep,
  onStepChange,
}) => (
  <FormProgress
    totalSteps={totalSteps}
    activeStep={activeStep}
    onStepChange={onStepChange}
  >
    <FormProgress.Step>Alder</FormProgress.Step>
    <FormProgress.Step>Utland</FormProgress.Step>
    <FormProgress.Step>Inntekt og alderspensjon</FormProgress.Step>
    <FormProgress.Step>Ektefelle</FormProgress.Step>
    <FormProgress.Step>AFP</FormProgress.Step>
  </FormProgress>
)

export default FormProgressComponent
