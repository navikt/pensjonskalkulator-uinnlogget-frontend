import { screen, fireEvent } from '@testing-library/react'
import UtlandsStep from '../UtlandsStep'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { State } from '@/common'
import { initialState } from '@/defaults/initialState'
import { useFieldChange } from '@/helpers/useFormState'
import {
  renderMockedComponent,
  generateDefaultFormPageProps,
} from '../test-utils/testSetup'
import { axe } from 'jest-axe'
import { useRouter } from 'next/navigation'
import { logger } from '@/components/utils/logging'

jest.mock('@/components/utils/logging', () => ({
  logger: jest.fn(),
}))

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

describe('UtlandsStep Component', () => {
  test('Burde ikke ha a11y violations', async () => {
    const { container } = renderMockedComponent(UtlandsStep, context)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('Burde rendre komponenten', () => {
    renderMockedComponent(UtlandsStep, context)
    expect(
      screen.getByText('Har du bodd eller jobbet utenfor Norge?')
    ).toBeVisible()

    const radioButtonJa = screen.getByLabelText('Ja')
    expect(radioButtonJa).toBeVisible()

    const radioButtonNei = screen.getByLabelText('Nei')
    expect(radioButtonNei).toBeVisible()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(UtlandsStep, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('UtlandsStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde logge når brukeren trykker på neste', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(UtlandsStep, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(logger).toHaveBeenCalledWith('button klikk', {
      tekst: 'Neste fra Utland',
    })
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(UtlandsStep, context)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('UtlandsStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('Gitt at radioknappene for harBoddIUtland finnes', () => {
    test('Burde harBoddIUtland endres når handleFieldChange kalles på', () => {
      renderMockedComponent(UtlandsStep, context)
      const radio = screen.getByLabelText('Ja')
      fireEvent.click(radio)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'harBoddIUtland'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.harBoddIUtland).toBeTruthy()
    })

    describe('Når harBoddIUtland er "Nei"', () => {
      test('Burde ikke tekstfelt for utenlandsAntallAar vises', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: false,
          },
        })
        expect(
          screen.queryByLabelText(
            'Hvor mange år har du bodd eller jobbet utenfor Norge?'
          )
        ).not.toBeInTheDocument()
      })
      test('Burde utenlandsAntallAar bli satt til undefined', async () => {
        renderMockedComponent(UtlandsStep, context)
        const radio = screen.getByLabelText('Nei')
        fireEvent.click(radio)
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'harBoddIUtland'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.utenlandsAntallAar).toBe(undefined)
      })
    })

    describe('Når harBoddIUtland er "Ja"', () => {
      test('Burde ikke ha noen a11y violations', async () => {
        const { container } = renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
          },
        })

        expect(await axe(container)).toHaveNoViolations()
      })

      test('Burde tekstfeltet for utenlandsAntallAar vises', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
          },
        })
        expect(
          screen.getByLabelText(
            'Hvor mange år har du bodd eller jobbet utenfor Norge?'
          )
        ).toBeVisible()
      })

      test('Burde utenlandsAntallAar endres når handleFieldChange kalles på', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd eller jobbet utenfor Norge?'
        )
        fireEvent.change(input, { target: { value: '5' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'utenlandsAntallAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.utenlandsAntallAar).toBe('5')
      })

      test('Burde sette utenlandsAntallAar til undefined når input er tom', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: '5',
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd eller jobbet utenfor Norge?'
        )
        fireEvent.change(input, { target: { value: '' } })

        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'utenlandsAntallAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.utenlandsAntallAar).toBe(undefined)
      })

      test('Burde vise tom input når utenlandsAntallAar er undefined', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: undefined,
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd eller jobbet utenfor Norge?'
        ) as HTMLInputElement
        expect(input.value).toBe('')
      })

      test('Burde vise riktig input når utenlandsAntallAar ikke er 0', () => {
        renderMockedComponent(UtlandsStep, {
          ...context,
          state: {
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: '5',
          },
        })
        const input = screen.getByLabelText(
          'Hvor mange år har du bodd eller jobbet utenfor Norge?'
        ) as HTMLInputElement
        expect(input.value).toBe('5')
      })
    })
  })
})
