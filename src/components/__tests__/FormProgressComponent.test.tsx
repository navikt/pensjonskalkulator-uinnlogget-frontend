import { render } from '@testing-library/react'
import FormProgressComponent from '../FormProgressComponent'

describe('FormProgressComponent', () => {
  it('Burde rendrer korrekt med totalSteps and activeStep', () => {
    const totalSteps = 5
    const activeStep = 3

    const { getByTestId, container } = render(
      <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    )

    const formProgress = getByTestId('form-progress')
    expect(formProgress).toBeInTheDocument()

    const steps = container.querySelectorAll('li')
    expect(steps).toHaveLength(totalSteps)

    const activeStepElement = steps[activeStep]
    expect(activeStepElement).toHaveClass('navds-stepper__item')
  })
})
