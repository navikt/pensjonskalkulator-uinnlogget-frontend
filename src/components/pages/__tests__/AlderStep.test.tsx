import { State } from '@/common'
import { logger } from '@/components/utils/logging'
import { initialState } from '@/defaults/initialState'
import { useFieldChange } from '@/helpers/useFormState'
import { fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { useRouter } from 'next/navigation'

import useErrorHandling from '../../../helpers/useErrorHandling'
import AlderStep from '../AlderStep'
import {
  generateDefaultFormPageProps,
  renderMockedComponent,
} from '../test-utils/testSetup'

jest.mock('@/components/utils/logging', () => ({
  logger: jest.fn(),
}))

jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the useFieldChange hook
jest.mock('@/helpers/useFormState', () => ({
  __esModule: true,
  useFieldChange: jest.fn(),
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
const mockHandleFieldChange = jest.fn((updateFn) => {
  const draft: State = { ...initialState }
  updateFn(draft)
  return draft
})

const context = {
  setState: mockSetState,
  state: initialState,
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
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
})

describe('AlderStep Component', () => {
  test('Burde ikke ha a11y violations', async () => {
    const { container } = renderMockedComponent(AlderStep, context)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('Burde gå videre dersom det ikke er feil i input', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(AlderStep, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde logge når brukeren trykker på neste', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(AlderStep, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(logger).toHaveBeenCalledWith('button klikk', {
      tekst: 'Neste fra Alder og yrkesaktivitet',
    })
  })

  test('Burde ikke gå videre dersom det er feil i input', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(AlderStep, context)
    const form = screen.getByTestId('form')
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
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AlderStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
    expect(screen.getByText('Dette feltet er påkrevd')).toBeVisible()
  })

  test('Burde ikke ha a11y violations dersom errorFields inneholder noe', async () => {
    const errorFields = {
      foedselAar: 'Dette feltet er påkrevd',
    }
    ;(useErrorHandling as jest.Mock).mockReturnValue([
      errorFields,
      { validateFields: mockValidateFields, clearError: mockClearError },
    ])
    const { container } = renderMockedComponent(AlderStep, context)
    expect(await axe(container)).toHaveNoViolations()
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
      expect(draft.foedselAar).toBe('1990')
    })

    test('Burde være tom dersom foedselAar er null', () => {
      const state = { ...initialState, foedselAar: null }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'I hvilket år er du født?'
      ) as HTMLInputElement

      expect(input.value).toBe('')
    })

    test('Burde settes til null dersom input er tom', () => {
      const state = { ...initialState, foedselAar: '1960' }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText('I hvilket år er du født?')
      fireEvent.change(input, { target: { value: '' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'foedselAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.foedselAar).toBe(null)
    })

    test('Burde vise foedselAar dersom det er satt', () => {
      const state = { ...initialState, foedselAar: '1998' }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText('I hvilket år er du født?')
      expect(input).toHaveValue('1998')
    })

    test('Burde godta bokstaver', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText('I hvilket år er du født?')
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'foedselAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.foedselAar).toBe('abc')
    })
  })

  describe('TextField for inntektOver1GAntallAar', () => {
    test('Burde endre inntektOver1GAntallAar når handleFieldChange kalles på', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText(
        'Hvor mange år har du jobbet i Norge når du tar ut pensjon?'
      )
      fireEvent.change(input, { target: { value: '10' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'inntektOver1GAntallAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.inntektOver1GAntallAar).toBe('10')
    })

    test('Burde være tom dersom inntektOver1GAntallAar er undefined', () => {
      const state = { ...initialState, inntektOver1GAntallAar: null }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'Hvor mange år har du jobbet i Norge når du tar ut pensjon?'
      ) as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('Burde settes til undefined dersom input er tom', () => {
      const state = { ...initialState, inntektOver1GAntallAar: '30' }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'Hvor mange år har du jobbet i Norge når du tar ut pensjon?'
      )
      fireEvent.change(input, { target: { value: '' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'inntektOver1GAntallAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.inntektOver1GAntallAar).toBe(null)
    })

    test('Burde vise inntektOver1GAntallAar dersom det er satt', () => {
      const state = { ...initialState, inntektOver1GAntallAar: '30' }
      renderMockedComponent(AlderStep, { ...context, state })
      const input = screen.getByLabelText(
        'Hvor mange år har du jobbet i Norge når du tar ut pensjon?'
      )
      expect(input).toHaveValue('30')
    })

    test('Burde godta bokstaver', () => {
      renderMockedComponent(AlderStep, context)
      const input = screen.getByLabelText(
        'Hvor mange år har du jobbet i Norge når du tar ut pensjon?'
      )
      fireEvent.change(input, { target: { value: 'abc' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'inntektOver1GAntallAar'
      )
      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.inntektOver1GAntallAar).toBe('abc')
    })
  })
})
