import { screen, fireEvent } from '@testing-library/react'
import AFPStep from '../AFPStep'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { initialFormState } from '@/defaults/defaultFormState'
import { renderMockedComponent } from '../test-utils/testSetup'
import { State } from '@/common'
import { useFieldChange } from '@/helpers/useFormState'

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

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()
const mockHandleFieldChange = jest.fn((updateFn) => {
  const draft: State = { ...initialFormState }
  updateFn(draft)
  return draft
})

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
  ;(useFieldChange as jest.Mock).mockReturnValue({
    handleFieldChange: mockHandleFieldChange,
  })
})

describe('AFPStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderMockedComponent(() => <AFPStep />, context)
    expect(
      screen.getByText('Har du rett til AFP i privat sektor?')
    ).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(() => <AFPStep />, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('AFPStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('Gitt at brukeren velger AFP', () => {
    test('Burde state få riktig verdi ved Ja', () => {
      renderMockedComponent(() => <AFPStep />, context)
      const select = screen.getByLabelText('Ja')
      fireEvent.click(select)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'simuleringType'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.simuleringType).toBe('ALDERSPENSJON_MED_AFP_PRIVAT')
    })

    test('Burde state få riktig verdi ved Nei', () => {
      renderMockedComponent(() => <AFPStep />, context)
      const select = screen.getByLabelText('Nei')
      fireEvent.click(select)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'simuleringType'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.simuleringType).toBe('ALDERSPENSJON')
    })
  })

  describe('Gitt at brukeren har valgt AFP tidligere', () => {
    test('Burde "Ja" være avhuket dersom "Ja" er tidligere avhuket', () => {
      const contextWithState = {
        ...context,
        state: {
          ...initialFormState,
          simuleringType: 'ALDERSPENSJON_MED_AFP_PRIVAT',
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
          ...initialFormState,
          simuleringType: 'ALDERSPENSJON',
        },
      }

      renderMockedComponent(() => <AFPStep />, contextWithState)

      expect(screen.getByLabelText('Ja')).not.toBeChecked()
      expect(screen.getByLabelText('Nei')).toBeChecked()
    })
  })
})
