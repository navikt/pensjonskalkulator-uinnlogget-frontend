import { render, screen } from '@testing-library/react'
import FormPage from '@/components/FormPage'

const steps = [
  <div key="step1">First Step</div>,
  <div key="step2">Second Step</div>,
  <div key="step3">Third Step</div>,
]

jest.mock('@/helpers/useMultiStepForm', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    curStep: 0,
    length: steps.length,
    step: steps[0],
    next: jest.fn(),
    back: jest.fn(),
    goTo: jest.fn(),
  })),
}))

describe('FormPage Component', () => {
  const grunnbelop = 100000

  const renderFormPage = () => {
    return render(<FormPage grunnbelop={grunnbelop} />)
  }

  test('Burde rendre komponenten', () => {
    renderFormPage()
    expect(screen.getByText('Pensjonskalkulator')).toBeInTheDocument()
  })

  test('Burde rendre første steget', () => {
    renderFormPage()
    expect(screen.getByText('First Step')).toBeInTheDocument()
  })
})
