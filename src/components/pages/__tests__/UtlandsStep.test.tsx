import { render, screen, fireEvent } from '@testing-library/react'
import UtlandsStep from '../UtlandsStep'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { State } from '@/common'
import { initialFormState } from '@/defaults/defaultFormState'
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
  const draft: Partial<State> = {}
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

const renderComponent = (contextOverride = context) => {
  return render(
    <FormContext.Provider value={contextOverride}>
      <UtlandsStep />
    </FormContext.Provider>
  )
}

describe('UtlandsStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderComponent()
    expect(
      screen.getByText('Har du bodd eller arbeidet utenfor Norge?')
    ).toBeInTheDocument()

    const radioButtonJa = screen.getByLabelText('Ja')
    expect(radioButtonJa).toBeInTheDocument()

    const radioButtonNei = screen.getByLabelText('Nei')
    expect(radioButtonNei).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('UtlandsStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('UtlandsStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('Gitt at radioknappene for boddIUtland finnes', () => {
    test('Burde boddIUtland endres når handleFieldChange kalles på', () => {
      renderComponent()
      const radio = screen.getByLabelText('Ja')
      fireEvent.click(radio)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'boddIUtland'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.boddIUtland).toBe('ja')
    })

    describe('Når boddIUtland er "Nei"', () => {
      test('Burde ikke tekstfelt for utenlandsAntallAar vises', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'nei',
          },
        })
        expect(
          screen.queryByLabelText('Hvor mange år har du bodd i utlandet?')
        ).not.toBeInTheDocument()
      })
    })

    describe('Når boddIUtland er "Ja"', () => {
      test('Burde tekstfeltet for utenlandsAntallAar vises', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'ja',
          },
        })
        expect(
          screen.getByLabelText('Hvor mange år har du bodd i utlandet?')
        ).toBeInTheDocument()
      })

      test('Burde utenlandsAntallAar endres når handleFieldChange kalles på', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'ja',
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd i utlandet?'
        )
        fireEvent.change(input, { target: { value: '5' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'utenlandsAntallAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.utenlandsAntallAar).toBe(5)
      })

      test('Burde sette utenlandsAntallAar til 0 når input er tom', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: 5,
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd i utlandet?'
        )
        fireEvent.change(input, { target: { value: '' } })

        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'utenlandsAntallAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.utenlandsAntallAar).toBe(0)
      })

      test('Burde vise tom input når utenlandsAntallAar er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: 0,
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd i utlandet?'
        ) as HTMLInputElement
        expect(input.value).toBe('')
      })

      test('Burde vise riktig input når utenlandsAntallAar ikke er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: 5,
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd i utlandet?'
        ) as HTMLInputElement
        expect(input.value).toBe('5')
      })
    })
  })
})
