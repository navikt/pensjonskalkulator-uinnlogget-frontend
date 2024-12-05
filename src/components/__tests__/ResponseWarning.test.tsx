import { render, screen } from '@testing-library/react'
import ResponseWarning from '../ResponseWarning'
import { SimuleringError } from '@/common'
import { getErrors } from '@/texts/errors'
import { initialState } from '@/defaults/initialState'
import {
  generateDefaultFormPageProps,
  renderMockedComponent,
} from '../pages/test-utils/testSetup'

jest.mock('@/texts/errors', () => ({
  getErrors: jest.fn(),
}))

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const context = {
  setState: mockSetState,
  state: initialState,
  formPageProps: generateDefaultFormPageProps(mockGoToNext),
}

const errorMessageMock: { [key: string]: string } = {
  PEK100: 'Warning: Invalid response PEK100',
  default: 'Warning: Invalid response default',
}

describe('ResponseWarning Component', () => {
  const errorObject: SimuleringError = {
    status: '',
    message: 'Invalid response',
  }

  beforeEach(() => {
    ;(getErrors as jest.Mock).mockReturnValue(errorMessageMock)
  })

  test('Should render the warning message', () => {
    const status = 'PEK100'

    const error = { ...errorObject, status: status }
    render(<ResponseWarning error={error} />)
    const warningMessage = screen.getByText(errorMessageMock[status])
    expect(warningMessage).toBeInTheDocument()
  })

  test('Should render the default warning message if no error is provided', () => {
    const error = undefined
    render(<ResponseWarning error={error} />)
    const warningMessage = screen.getByText(errorMessageMock.default)
    expect(warningMessage).toBeInTheDocument()
  })

  describe('Gitt at brukeren trykker på "Endre" knappen', () => {
    test('Skal funksjonen goTo kalles', () => {
      const error = { ...errorObject, status: 'PEK100' }
      renderMockedComponent(() => <ResponseWarning error={error} />, context)
      const button = screen.getByRole('button')
      button.click()
      expect(context.formPageProps.goTo).toHaveBeenCalled()
    })
  })
})
