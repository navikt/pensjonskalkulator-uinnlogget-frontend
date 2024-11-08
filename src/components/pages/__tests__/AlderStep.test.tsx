import { screen, fireEvent } from '@testing-library/react'
import AlderStep from '../AlderStep'

import useErrorHandling from '../../../helpers/useErrorHandling'
import { initialFormState } from '@/defaults/defaultFormState'
import { State } from '@/common'
import {
  generateDefaultFormPageProps,
  renderMockedComponent,
} from '../test-utils/testSetup'
import { useFieldChange } from '@/helpers/useFormState'

jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the useFieldChange hook
jest.mock('@/helpers/useFormState', () => ({
  __esModule: true,
  useFieldChange: jest.fn(),
}))

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()
const mockHandleFieldChange = jest.fn((updateFn) => {
  const draft: State = { ...initialFormState }
  updateFn(draft)
  return draft
})

const context = {
  setState: mockSetState,
  state: initialFormState,
  formPageProps: generateDefaultFormPageProps(mockGoToNext),
}

const mockValidateFields = jest.fn()
const mockClearError = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useErrorHandling as jest.Mock).mockReturnValue([
    {},
    { validateFields: mockValidateFields, clearError: mockClearError },
  ])
  ;(useFieldChange as jest.Mock).mockReturnValue({
    handleFieldChange: mockHandleFieldChange,
  })
})

describe('AlderStep Component', () => {
  test('Burde gå videre dersom det ikke er feil i input', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(AlderStep, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre dersom det er feil i input', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(AlderStep, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  test('Burde vise en feilmelding dersom errorFields inneholder noe', () => {
    const errorFields = {
      foedselAar: 'Dette feltet er påkrevd',
    }
    ;(useErrorHandling as jest.Mock).mockReturnValue([
      errorFields,
      { validateFields: mockValidateFields, clearError: mockClearError },
    ])
    renderMockedComponent(AlderStep, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
    expect(screen.getByText('Dette feltet er påkrevd')).toBeInTheDocument()
  })

  describe('TextField for foedselAar', () => {
    test('Burde endre foedselAar når handleFieldChange kalles på', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText('I hvilket år er du født?')
      fireEvent.change(input, { target: { value: '1990' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'foedselAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.foedselAar).toBe(1990)
    })

    test('Burde være tom dersom foedselAar er 0', () => {
      const state = { ...initialFormState, foedselAar: 0 }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'I hvilket år er du født?'
      ) as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('Burde vise foedselAar dersom det er satt', () => {
      const state = { ...initialFormState, foedselAar: 1998 }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText('I hvilket år er du født?')
      expect(input).toHaveValue(1998)
    })

    test('Burde ikke godta bokstaver', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText('I hvilket år er du født?')
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(mockHandleFieldChange).not.toHaveBeenCalled()
    })
  })

  describe('TextField for inntektOver1GAntallAar', () => {
    test('Burde endre inntektOver1GAntallAar når handleFieldChange kalles på', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText(
        'Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
      )
      fireEvent.change(input, { target: { value: '10' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'inntektOver1GAntallAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.inntektOver1GAntallAar).toBe(10)
    })

    test('Burde være tom dersom inntektOver1GAntallAar er 0', () => {
      const state = { ...initialFormState, inntektOver1GAntallAar: 0 }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
      ) as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('Burde vise inntektOver1GAntallAar dersom det er satt', () => {
      const state = { ...initialFormState, inntektOver1GAntallAar: 30 }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
      )
      expect(input).toHaveValue(30)
    })

    test('Burde ikke godta bokstaver', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText(
        'Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
      )
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(mockHandleFieldChange).not.toHaveBeenCalled()
    })
  })
})
