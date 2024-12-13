import { FormContext } from '@/contexts/context'
import { FormProgress } from '@navikt/ds-react'
import { useContext } from 'react'
import stepStyles from './styles/stepStyles.module.css'

interface FormProgressComponentProps {
  totalSteps: number
  activeStep: number
}

const FormProgressComponent: React.FC<FormProgressComponentProps> = ({
  totalSteps,
  activeStep,
}) => {
  const steps = [
    'Alder og yrkesaktivitet',
    'Utland',
    'Inntekt og alderspensjon',
    'Sivilstand',
    'Avtalefestet pensjon (AFP)',
  ]

  const { formPageProps } = useContext(FormContext)

  return (
    <FormProgress
      className={stepStyles.componentSpacing}
      totalSteps={totalSteps}
      activeStep={activeStep + 1}
      data-testid="form-progress"
      onStepChange={(step) => formPageProps.goTo(step - 1)}
    >
      {steps.map((step, index) => (
        <FormProgress.Step
          completed={activeStep > index}
          interactive={activeStep >= index}
          key={index}
        >
          {step}
        </FormProgress.Step>
      ))}
    </FormProgress>
  )
}

export default FormProgressComponent
