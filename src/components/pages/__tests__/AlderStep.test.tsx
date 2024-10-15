import { render, screen, fireEvent } from '@testing-library/react'
import AlderStep from '../AlderStep'
import { FormContext } from '@/contexts/context'

import useErrorHandling from '../../../helpers/useErrorHandling'
import { initialFormState } from '@/defaults/defaultFormState'

jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../FormButtons', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked FormButtons</div>),
}))

describe('AlderStep Component', () => {
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
    state: initialFormState,
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
        <AlderStep />
      </FormContext.Provider>
    )
  }

  test('burde kalle validateFields og goToNext når form submittes dersom det ikke er feil i input', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('burde ikke kalle validateFields og goToNext når form submittes dersom det er feil i input', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })
})
