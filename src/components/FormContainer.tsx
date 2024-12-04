import React, { ReactElement } from 'react'
import { Box } from '@navikt/ds-react'
import FormProgressComponent from './FormProgressComponent'
import stepStyles from './styles/stepStyles.module.css'

interface FormContainerComponentProps {
  totalSteps: number
  activeStep: number
  step: ReactElement | null
}

const FormContainerComponent: React.FC<FormContainerComponentProps> = ({
  totalSteps,
  activeStep,
  step,
}) => (
  <Box
    maxWidth={'40rem'}
    width={'100%'}
    marginInline={'auto'}
    borderColor="border-default"
    padding={'4'}
    borderRadius={'large'}
  >
    <h1 className={stepStyles.overskrift}>Uinnlogget pensjonskalkulator</h1>
    <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    {step}
  </Box>
)

export default FormContainerComponent
