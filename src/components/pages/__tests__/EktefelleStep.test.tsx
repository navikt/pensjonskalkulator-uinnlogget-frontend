import { screen, fireEvent } from '@testing-library/react'
import EktefelleStep from '../EktefelleStep'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { State } from '@/common'
import { initialState } from '@/defaults/initialState'
import { useFieldChange } from '@/helpers/useFormState'
import {
  renderMockedComponent,
  generateDefaultFormPageProps,
} from '../test-utils/testSetup'

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
})

describe('EktefelleStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, context)
    expect(screen.getByLabelText('Hva er din sivilstand?')).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('EktefelleStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('EktefelleStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('Gitt at brukeren har valgt sivilstand', () => {
    test('Burde handleFieldChange bli kalt når sivilstand endres', () => {
      renderMockedComponent(
        () => <EktefelleStep grunnbelop={100000} />,
        context
      )
      const select = screen.getByLabelText('Hva er din sivilstand?')
      fireEvent.change(select, { target: { value: 'GIFT' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'sivilstand'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.sivilstand).toBe('GIFT')
    })

    describe('Når sivilstand ikke er valgt', () => {
      test('Burde ikke radioknapper bli vist', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: undefined,
          },
        })
        const select = screen.getByLabelText('Hva er din sivilstand?')
        fireEvent.change(select, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'sivilstand'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.sivilstand).toBe(undefined)
      })
    })

    describe('Når sivilstand er satt til UGIFT', () => {
      test('Burde ikke radioknapper bli vist', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'UGIFT',
          },
        })
        expect(screen.queryByLabelText('Ja')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Nei')).not.toBeInTheDocument()
      })

      test('Burde epsHarInntektOver2G og epsHarPensjon bli nullstilt', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
            epsHarInntektOver2G: true,
            epsHarPensjon: false,
          },
        })

        const select = screen.getByLabelText('Hva er din sivilstand?')
        fireEvent.change(select, { target: { value: 'UGIFT' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'sivilstand'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.sivilstand).toBe('UGIFT')
        expect(draft.epsHarInntektOver2G).toBe(undefined)
        expect(draft.epsHarPensjon).toBe(undefined)
      })
    })

    describe('Når sivilstand er satt til GIFT/SAMBOER', () => {
      test('Burde 2 radioknapper vises', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        expect(screen.getAllByLabelText('Ja')[0]).toBeInTheDocument()
        expect(screen.getAllByLabelText('Nei')[0]).toBeInTheDocument()
      })

      test('Burde begge radioknapper være unchecked som default', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        expect(screen.getAllByLabelText('Ja')[0]).not.toBeChecked()
        expect(screen.getAllByLabelText('Nei')[0]).not.toBeChecked()
      })

      test('Burde epsHarInntektOver2G være true når "Ja" er klikket', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        const radioButton = screen.getAllByLabelText('Ja')[0]
        fireEvent.click(screen.getAllByLabelText('Ja')[0])
        expect(radioButton).toBeChecked()
      })

      test('Burde epsHarPensjon være false når "Nei" er klikket', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        const radioButton = screen.getAllByLabelText('Nei')[1]
        fireEvent.click(screen.getAllByLabelText('Nei')[1])
        expect(radioButton).toBeChecked()
      })

      test('Burde epsHarInntektOver2G bli rendret riktig med en definert grunnbelop verdi', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={100000} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        expect(
          screen.getByText(
            /Har du ektefelle, partner eller samboer som har inntekt større enn 100000 kr/
          )
        ).toBeInTheDocument()
      })

      test('Burde epsHarInntektOver2G bli rendret riktig med udefinert grunnbelop verdi', () => {
        renderMockedComponent(() => <EktefelleStep grunnbelop={undefined} />, {
          ...context,
          state: {
            ...initialState,
            sivilstand: 'GIFT',
          },
        })
        expect(
          screen.getByText(
            /Har du ektefelle, partner eller samboer som har inntekt større enn 2G/
          )
        ).toBeInTheDocument()
      })
    })
  })
})
