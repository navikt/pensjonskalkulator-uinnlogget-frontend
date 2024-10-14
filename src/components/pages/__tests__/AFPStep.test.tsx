import { render, screen, fireEvent } from '@testing-library/react'
import AFPStep from '../AFPStep'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '../../FormPage'
import useErrorHandling from '../../../helpers/useErrorHandling'

// Mock the useErrorHandling hook
jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the FormButtons component
jest.mock('../../FormButtons', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormButtons</div>),
}))

describe('AFPStep Component', () => {
  const mockGoToNext = jest.fn()
  const mockSetState = jest.fn()

  const defaultFormPageProps = {
    curStep: 1,
    length: 5,
    goBack: jest.fn(),
    onStepChange: jest.fn(),
    handleSubmit: jest.fn(),
    goToNext: mockGoToNext,
  }

  const context = {
    setState: mockSetState,
    states: initialFormState,
    formPageProps: defaultFormPageProps,
  }

  const mockValidateFields = jest.fn()
  const mockClearError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useErrorHandling as jest.Mock).mockReturnValue([
      {},
      { validateFields: mockValidateFields, clearError: mockClearError },
    ])
  })

  const renderComponent = () => {
    return render(
      <FormContext.Provider value={context}>
        <AFPStep />
      </FormContext.Provider>
    )
  }

  test('should render the component', () => {
    renderComponent()
    expect(
      screen.getByText('Har du rett til AFP i privat sektor?')
    ).toBeInTheDocument()
    expect(screen.getByText('Mocked FormButtons')).toBeInTheDocument()
  })

  test('should call handleFieldChange on radio button change', () => {
    renderComponent()
    const radioButton = screen.getByLabelText('Ja')
    fireEvent.click(radioButton)
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))
    expect(mockClearError).toHaveBeenCalledWith('simuleringType')
  })

  test('should call validateFields and goToNext on form submit if no errors', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('should not call goToNext on form submit if there are errors', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })
})
