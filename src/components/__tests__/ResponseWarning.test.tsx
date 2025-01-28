import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import {
  generateDefaultFormPageProps,
  renderMockedComponent,
} from '../pages/test-utils/testSetup'
import ResponseWarning from '../ResponseWarning'
import { logger } from '../utils/logging'
import { SimuleringError } from '@/common'
import { initialState } from '@/defaults/initialState'
import { getErrors } from '@/texts/errors'

jest.mock('../utils/logging', () => ({
  logger: jest.fn(),
}))

jest.mock('@/texts/errors', () => ({
  getErrors: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockRouter = {
  prefetch: jest.fn(),
  push: jest.fn(),
}

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
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  test('Burde rendre feilmeldingen', () => {
    const status = 'PEK100'

    const error = { ...errorObject, status: status }
    render(<ResponseWarning error={error} />)
    const warningMessage = screen.getByText(errorMessageMock[status])
    expect(warningMessage).toBeVisible()
  })

  test('Burde logge feilmeldingen', () => {
    const status = 'PEK100'

    const error = { ...errorObject, status: status }
    render(<ResponseWarning error={error} />)
    expect(logger).toHaveBeenCalled()
    expect(logger).toHaveBeenCalledWith('alert', {
      tekst: errorMessageMock[status],
    })
  })

  test('Skal kaste "Error is undefined" hvis ingen feil er angitt', () => {
    const error = undefined
    const container = () => render(<ResponseWarning error={error} />)
    expect(container).toThrow('Error is undefined')
  })

  describe('Gitt at brukeren trykker på "Endre uttak" knappen', () => {
    test('Skal funksjonen goTo kalles', () => {
      const error = { ...errorObject, status: 'PEK100' }
      renderMockedComponent(() => <ResponseWarning error={error} />, context)
      const button = screen.getByText('Endre uttak')
      button.click()
      expect(context.formPageProps.goTo).toHaveBeenCalled()
    })
  })
})
