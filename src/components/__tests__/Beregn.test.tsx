import { render, screen } from '@testing-library/react'
import Beregn from '../Beregn'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '@/defaults/defaultFormState'

jest.mock('highcharts-react-official', () => {
  const MockHighchartsReact = () => <div data-testid="highcharts-react"></div>
  MockHighchartsReact.displayName = 'MockHighchartsReact'
  return MockHighchartsReact
})

const mockBeregnResult = {
  alderspensjon: [
    { alder: 67, beloep: 200000 },
    { alder: 68, beloep: 210000 },
  ],
  afpPrivat: [
    { alder: 67, beloep: 50000 },
    { alder: 68, beloep: 55000 },
  ],
  afpOffentlig: [],
  vilkaarsproeving: {
    vilkaarErOppfylt: true,
    alternativ: {
      heltUttaksalder: { aar: 67, maaneder: 0 },
      gradertUttaksalder: { aar: 67, maaneder: 0 },
      uttaksgrad: 100,
    },
  },
}
const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  onStepChange: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: initialFormState,
  setState: mockSetState,
  formPageProps: defaultFormPageProps,
}

describe('Beregn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendring', () => {
    it('Burde rendre ResultTable med riktige props', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByText('Resultat')).toBeInTheDocument()
      expect(screen.getByTestId('result-table')).toBeInTheDocument()
    })

    it('Burde rendre HighchartsReact med riktige alternativer', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()
    })

    it('Burde rendere Box', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  describe('Gitt at beregnResult er undefined', () => {
    it('Burde inntektVsaHelPensjonBeloep som ikke er 0 eller undefined bli håndtert', () => {
      const contextValueWithInntekt = {
        ...mockContextValue,
        state: {
          ...mockContextValue.state,
          heltUttak: {
            ...mockContextValue.state.heltUttak,
            aarligInntektVsaPensjon: {
              beloep: 100000,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          },
        },
      }

      render(
        <FormContext.Provider value={contextValueWithInntekt}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()
    })

    it('Burde sluttAlder som er undefined bli håndtert', () => {
      const contextValueWithUndefinedSluttalder = {
        ...mockContextValue,
        state: {
          ...mockContextValue.state,
          heltUttak: {
            ...mockContextValue.state.heltUttak,
            aarligInntektVsaPensjon: {
              beloep: 100000,
              sluttAlder: undefined,
            },
          },
        },
      }

      render(
        <FormContext.Provider value={contextValueWithUndefinedSluttalder}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()
    })

    it('Burde highchart alderspensjonData returnere riktig data dersom beregnResult er tom', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => undefined }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()
    })
  })
})
