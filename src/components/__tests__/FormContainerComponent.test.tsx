import { render, screen } from '@testing-library/react'
import FormContainerComponent from '../FormContainerComponent'
import FormProgressComponent from '../FormProgressComponent'

// Mock FormProgressComponent for å isolere testene
jest.mock('../FormProgressComponent', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormProgressComponent</div>),
}))

describe('FormContainerComponent', () => {
  const defaultProps = {
    totalSteps: 5,
    activeStep: 1,
    goBack: jest.fn(),
    onStepChange: jest.fn(),
    handleSubmit: jest.fn(),
    step: <div>Mocked Step</div>,
    curStep: 1,
    length: 5,
  }

  const renderComponent = (props = {}) => {
    return render(<FormContainerComponent {...defaultProps} {...props} />)
  }

  test('skal rendre komponenten', () => {
    renderComponent()
    expect(screen.getByText('Pensjonskalkulator')).toBeInTheDocument()
  })

  test('skal rendre FormProgressComponent med riktige props', () => {
    renderComponent()
    expect(screen.getByText('Mocked FormProgressComponent')).toBeInTheDocument()
    expect(FormProgressComponent).toHaveBeenCalledWith(
      {
        totalSteps: defaultProps.totalSteps,
        activeStep: defaultProps.activeStep,
      },
      {}
    )
  })

  test('skal rendre det nåværende steget', () => {
    renderComponent()
    expect(screen.getByText('Mocked Step')).toBeInTheDocument()
  })
})
