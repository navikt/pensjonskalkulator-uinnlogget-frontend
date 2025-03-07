import React, { ReactElement } from 'react'

import { Box, Heading } from '@navikt/ds-react'

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
    <Heading level="1" size="large" className={stepStyles.overskrift}>
      Uinnlogget pensjonskalkulator
    </Heading>
    <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    {step}
  </Box>
)

export default FormContainerComponent
