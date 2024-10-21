import { render, screen, fireEvent } from '@testing-library/react'
import EktefelleStep from '../EktefelleStep'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { FormValues } from '@/common'
import { initialFormState } from '../../FormPage'
import { useFieldChange } from '@/helpers/useFormState'

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

// Mock the useFieldChange hook
jest.mock('@/helpers/useFormState', () => ({
  __esModule: true,
  useFieldChange: jest.fn(),
}))

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()
const mockHandleFieldChange = jest.fn((updateFn) => {
  const draft: Partial<FormValues> = {}
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
  ;(useFieldChange as jest.Mock).mockReturnValue({
    handleFieldChange: mockHandleFieldChange,
  })
})

const renderComponent = (contextOverride = context) => {
  return render(
    <FormContext.Provider value={contextOverride}>
      <EktefelleStep grunnbelop={100000} />
    </FormContext.Provider>
  )
}

describe('EktefelleStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderComponent()
    expect(screen.getByLabelText('Hva er din sivilstand?')).toBeInTheDocument()
    expect(screen.getByText('Mocked FormButtons')).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet sendes inn uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('EktefelleStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre til neste step når skjemaet sendes inn med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('EktefelleStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('sivilstand', () => {
    test('Burde kalle handleFieldChange når sivilstand endres', () => {
      renderComponent()
      const select = screen.getByLabelText('Hva er din sivilstand?')
      fireEvent.change(select, { target: { value: 'GIFT' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'sivilstand'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.sivilstand).toBe('GIFT')
    })

    describe('UGIFT', () => {
      test('Burde ikke vise radiobuttons', () => {
        renderComponent({
          ...context,
          states: {
            ...initialFormState,
            sivilstand: 'UGIFT',
          },
        })
        expect(screen.queryByLabelText('Ja')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Nei')).not.toBeInTheDocument()
      })
    })

    describe('GIFT/SAMBOER', () => {
      test('Burde vise 2 radiobuttons', () => {
        renderComponent({
          ...context,
          states: {
            ...initialFormState,
            sivilstand: 'GIFT',
          },
        })
        expect(screen.getAllByLabelText('Ja')[0]).toBeInTheDocument()
        expect(screen.getAllByLabelText('Nei')[0]).toBeInTheDocument()
      })

      test('Begge radiobuttons burde default være unchecked', () => {
        renderComponent({
          ...context,
          states: {
            ...initialFormState,
            sivilstand: 'GIFT',
          },
        })
        expect(screen.getAllByLabelText('Ja')[0]).not.toBeChecked()
        expect(screen.getAllByLabelText('Nei')[0]).not.toBeChecked()
      })

      test('Ved klikk på "Ja" på epsHarInntektOver2G burde verdien være true', () => {
        renderComponent({
          ...context,
          states: {
            ...initialFormState,
            sivilstand: 'GIFT',
          },
        })
        const radioButton = screen.getAllByLabelText('Ja')[0]
        fireEvent.click(screen.getAllByLabelText('Ja')[0])
        expect(radioButton).toBeChecked()
      })

      test('Ved klikk på "Nei" på epsHarPensjon burde verdien være false', () => {
        renderComponent({
          ...context,
          states: {
            ...initialFormState,
            sivilstand: 'GIFT',
          },
        })
        const radioButton = screen.getAllByLabelText('Nei')[1]
        fireEvent.click(screen.getAllByLabelText('Nei')[1])
        expect(radioButton).toBeChecked()
      })
    })
  })
})
