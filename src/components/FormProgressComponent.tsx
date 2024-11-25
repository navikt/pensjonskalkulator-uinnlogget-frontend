import React from 'react'
import { FormProgress } from '@navikt/ds-react'

interface FormProgressComponentProps {
  totalSteps: number
  activeStep: number
}

const FormProgressComponent: React.FC<FormProgressComponentProps> = ({
  totalSteps,
  activeStep,
}) => {
  const steps = [
    'Alder',
    'Utland',
    'Inntekt og alderspensjon',
    'Ektefelle',
    'AFP',
  ]

  return (
    <FormProgress
      totalSteps={totalSteps}
      activeStep={activeStep + 1}
      data-testid="form-progress"
    >
      {steps.map((step: string, index: number) => (
        <FormProgress.Step
          completed={activeStep > index + 1}
          interactive={activeStep >= index + 1}
          key={`step-${index + 1}`}
        >
          {step}
        </FormProgress.Step>
      ))}
    </FormProgress>
  )
}

export default FormProgressComponent
