import React, { ReactElement } from 'react'
import { Box } from '@navikt/ds-react'
import FormProgressComponent from './FormProgressComponent'

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
    <Box paddingBlock={'4'} style={{ fontWeight: 'bold', fontSize: '2rem' }}>
      Pensjonskalkulator
    </Box>
    <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    {step}
  </Box>
)

export default FormContainerComponent
