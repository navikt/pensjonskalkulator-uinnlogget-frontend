import { StepName } from '@/common'
import { render } from '@testing-library/react'

import FormProgressComponent from '../FormProgressComponent'

describe('FormProgressComponent', () => {
  it('Burde rendrer korrekt med totalSteps and activeStep', () => {
    const totalSteps = 5
    const activeStep = 3

    const stepHeadings: Record<StepName, string> = {
      AlderStep: 'Alder',
      UtlandsStep: 'Opphold utenfor Norge',
      InntektStep: 'Inntekt og alderspensjon',
      SivilstandStep: 'Sivilstand',
      AFPStep: 'AFP',
    }

    const { getByTestId, container } = render(
      <FormProgressComponent totalSteps={totalSteps} activeStep={activeStep} />
    )

    const formProgress = getByTestId('form-progress')
    expect(formProgress).toBeVisible()

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
