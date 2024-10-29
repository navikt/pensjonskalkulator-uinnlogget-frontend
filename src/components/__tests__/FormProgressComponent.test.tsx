import { render } from '@testing-library/react'
import FormProgressComponent from '../FormProgressComponent'
import { StepName } from '@/common'

describe('FormProgressComponent', () => {
  it('Burde rendrer korrekt med totalSteps and activeStep', () => {
    const totalSteps = 5
    const activeStep = 3

    const stepHeadings: Record<StepName, string> = {
      AlderStep: 'Alder',
      UtlandsStep: 'Utland',
      InntektStep: 'Inntekt og alderspensjon',
      EktefelleStep: 'Ektefelle',
      AFPStep: 'AFP',
    }

    const { getByTestId, container } = render(
      <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    )

    const formProgress = getByTestId('form-progress')
    expect(formProgress).toBeInTheDocument()

    const steps = container.querySelectorAll('li')
    expect(steps).toHaveLength(totalSteps)

    Object.keys(stepHeadings).forEach((step, index) => {
      const stepElement = steps[index]
      expect(stepElement).toHaveTextContent(stepHeadings[step as StepName])
    })

    const activeStepElement = steps[activeStep]
    expect(activeStepElement).toHaveClass('navds-stepper__item')
  })
})
