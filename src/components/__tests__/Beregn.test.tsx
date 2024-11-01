import { render, screen } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import Beregn from '@/components/Beregn'
import { initialFormState } from '@/defaults/defaultFormState'
import { getChartOptions } from '../utils/chartUtils'

jest.mock('highcharts-react-official', () => {
  const MockHighchartsReact = () => <div data-testid="highcharts-react"></div>
  MockHighchartsReact.displayName = 'MockHighchartsReact'
  return MockHighchartsReact
})

jest.mock('../utils/chartUtils', () => ({
  getChartOptions: jest.fn(() => ({
    chart: { type: 'column' },
    title: { text: 'Beregnet framtidig alderspensjon (kroner per år):' },
    xAxis: { categories: ['60', '61', '62'] },
    yAxis: { title: { text: 'Beløp' } },
    series: [
      { name: 'AFP Privat', data: [10000, 20000, 30000] },
      { name: 'Alderspensjon', data: [15000, 25000, 35000] },
    ],
  })),
}))

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

    it('Burde rendre Highcharts med riktig data', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()

      const heltUttakAlder = 67
      const inntektVsaHelPensjonBeloep = 100000
      const inntektVsaHelPensjonSluttalder = 72
      const chartOptions = getChartOptions(
        heltUttakAlder,
        inntektVsaHelPensjonBeloep,
        inntektVsaHelPensjonSluttalder,
        mockBeregnResult
      )
      expect(chartOptions.chart.type).toBe('column')
      expect(chartOptions.title.text).toBe(
        'Beregnet framtidig alderspensjon (kroner per år):'
      )
      expect(chartOptions.xAxis.categories).toEqual(['60', '61', '62'])
      expect(chartOptions.series).toEqual([
        { name: 'AFP Privat', data: [10000, 20000, 30000] },
        { name: 'Alderspensjon', data: [15000, 25000, 35000] },
      ])
    })

    it('Burde rendere grafen med riktig søyler', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      const heltUttakAlder = 67
      const inntektVsaHelPensjonBeloep = 100000
      const inntektVsaHelPensjonSluttalder = 72
      const chartOptions = getChartOptions(
        heltUttakAlder,
        inntektVsaHelPensjonBeloep,
        inntektVsaHelPensjonSluttalder,
        mockBeregnResult
      )

      const seriesNames = chartOptions.series.map((series) => series.name)
      expect(seriesNames).toContain('AFP Privat')
      expect(seriesNames).toContain('Alderspensjon')
    })

    it('Burde håndtere sluttAlder som er undefined', () => {
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

    it('Burde returnere riktig data dersom beregnResult er tom', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => undefined }} />
        </FormContext.Provider>
      )

      expect(screen.getByTestId('highcharts-react')).toBeInTheDocument()
    })

    it('Burde bruke fallback verdi 0 for inntektVsaHelPensjonBeloep når aarligInntektVsaPensjon er undefined', () => {
      const contextValueWithUndefinedInntekt = {
        ...mockContextValue,
        state: {
          ...mockContextValue.state,
          heltUttak: {
            ...mockContextValue.state.heltUttak,
            aarligInntektVsaPensjon: undefined,
          },
        },
      }

      render(
        <FormContext.Provider value={contextValueWithUndefinedInntekt}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      const heltUttakAlder = 67
      const inntektVsaHelPensjonBeloep = 0
      const inntektVsaHelPensjonSluttalder = 72
      const chartOptions = getChartOptions(
        heltUttakAlder,
        inntektVsaHelPensjonBeloep,
        inntektVsaHelPensjonSluttalder,
        mockBeregnResult
      )

      expect(chartOptions.series).toEqual([
        { name: 'AFP Privat', data: [10000, 20000, 30000] },
        { name: 'Alderspensjon', data: [15000, 25000, 35000] },
      ])
    })
  })
})
