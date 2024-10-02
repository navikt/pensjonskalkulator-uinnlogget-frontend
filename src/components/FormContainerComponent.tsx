import React, { FormEvent, ReactElement } from 'react'
import { Box, HStack, Button } from '@navikt/ds-react'
import FormProgressComponent from './FormProgressComponent'

interface FormContainerComponentProps {
  totalSteps: number
  activeStep: number
  onStepChange: (newStep: number) => void
  handleSubmit: (e: FormEvent) => void
  step: ReactElement | null
  childRef: React.RefObject<any>
  curStep: number
  length: number
}

const FormContainerComponent: React.FC<FormContainerComponentProps> = ({
  totalSteps,
  activeStep,
  onStepChange,
  handleSubmit,
  step,
  childRef,
  curStep,
  length,
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
    <FormProgressComponent
      totalSteps={totalSteps}
      activeStep={activeStep}
      onStepChange={onStepChange}
    />
    <form onSubmit={handleSubmit}>
      {step ? React.cloneElement(step, { ref: childRef }) : null}
      <HStack gap={'2'} marginBlock="2">
        <Button type="submit" variant="primary">
          {curStep === length - 1 ? 'Send' : 'Neste'}
        </Button>
        {curStep !== 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onStepChange(curStep - 1)}
          >
            Tilbake
          </Button>
        )}
      </HStack>
    </form>
  </Box>
)

export default FormContainerComponent