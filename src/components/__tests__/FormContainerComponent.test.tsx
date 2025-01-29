import FormContainerComponent from '../FormContainer'
import FormProgressComponent from '../FormProgressComponent'
import { render, screen } from '@testing-library/react'

// Mock FormProgressComponent for å isolere testene
jest.mock('../FormProgressComponent', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormProgressComponent</div>),
}))

describe('FormContainer component', () => {
  const defaultProps = {
    totalSteps: 5,
    activeStep: 1,
    goBack: jest.fn(),
    goTo: jest.fn(),
    handleSubmit: jest.fn(),
    step: <div>Mocked Step</div>,
    curStep: 1,
    length: 5,
  }

  const renderComponent = (props = {}) => {
    return render(<FormContainerComponent {...defaultProps} {...props} />)
  }

  test('Skal rendre komponenten', () => {
    renderComponent()
    expect(screen.getByText('Uinnlogget pensjonskalkulator')).toBeVisible()
  })

  test('Skal rendre FormProgressComponent med riktige props', () => {
    renderComponent()
    expect(screen.getByText('Mocked FormProgressComponent')).toBeVisible()
    expect(FormProgressComponent).toHaveBeenCalledWith(
      {
        totalSteps: defaultProps.totalSteps,
        activeStep: defaultProps.activeStep,
      },
      {}
    )
  })

  test('Skal rendre det nåværende steget', () => {
    renderComponent()
    expect(screen.getByText('Mocked Step')).toBeVisible()
  })
})
