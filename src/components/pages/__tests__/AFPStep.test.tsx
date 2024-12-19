import { screen, fireEvent } from '@testing-library/react'
import AFPStep from '../AFPStep'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { initialState } from '@/defaults/initialState'
import { renderMockedComponent } from '../test-utils/testSetup'
import { Simuleringstype, State } from '@/common'
import { useFieldChange } from '@/helpers/useFormState'
import { axe } from 'jest-axe'
import { useRouter } from 'next/navigation'
import { logger } from '@/components/utils/logging'

// Mock the useErrorHandling hook
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

jest.mock('@/components/utils/logging', () => ({
  logger: jest.fn(),
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

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  goTo: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const context = {
  setState: mockSetState,
  state: initialState,
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
  ;(useFieldChange as jest.Mock).mockReturnValue({
    handleFieldChange: mockHandleFieldChange,
  })
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
})

describe('AFPStep Component', () => {
  test('Burde ikke ha a11y violations', async () => {
    const { container } = renderMockedComponent(() => <AFPStep />, context)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('Burde rendre komponenten', () => {
    renderMockedComponent(() => <AFPStep />, context)
    expect(
      screen.getByText('Har du rett til AFP i privat sektor?')
    ).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde logge når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(logger).toHaveBeenCalledWith('button klikk', {
      tekst: 'Beregn pensjon i siste steg',
    })
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  test('Burde ikke ha a11y violations når skjemaet valideres med feil', async () => {
    mockValidateFields.mockReturnValue(true)
    const { container } = renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  describe('Gitt at brukeren velger AFP', () => {
    test('Burde state få riktig verdi ved "Ja"', () => {
      renderMockedComponent(() => <AFPStep />, context)
      const select = screen.getByLabelText('Ja')
      fireEvent.click(select)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'simuleringType'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.simuleringstype).toBe('ALDERSPENSJON_MED_AFP_PRIVAT')
    })

    test('Burde state få riktig verdi ved "Nei"', () => {
      renderMockedComponent(() => <AFPStep />, context)
      const select = screen.getByLabelText('Nei')
      fireEvent.click(select)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'simuleringType'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.simuleringstype).toBe('ALDERSPENSJON')
    })
  })

  describe('Gitt at brukeren har valgt AFP tidligere', () => {
    test('Burde "Ja" være avhuket dersom "Ja" er tidligere avhuket', () => {
      const contextWithState = {
        ...context,
        state: {
          ...initialState,
          simuleringstype: 'ALDERSPENSJON_MED_AFP_PRIVAT' as Simuleringstype,
        },
      }
      renderMockedComponent(() => <AFPStep />, contextWithState)

      expect(screen.getByLabelText('Ja')).toBeChecked()
      expect(screen.getByLabelText('Nei')).not.toBeChecked()
    })

    test('Burde "Nei" være avhuket dersom "Nei" er tidligere avhuket', () => {
      const contextWithState = {
        ...context,
        state: {
          ...initialState,
          simuleringstype: 'ALDERSPENSJON' as Simuleringstype,
        },
      }

      renderMockedComponent(() => <AFPStep />, contextWithState)

      expect(screen.getByLabelText('Ja')).not.toBeChecked()
      expect(screen.getByLabelText('Nei')).toBeChecked()
    })
  })
})
