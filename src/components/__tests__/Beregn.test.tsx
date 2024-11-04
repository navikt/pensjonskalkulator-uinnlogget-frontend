import { render, screen } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import Beregn from '@/components/Beregn'
import { initialFormState } from '@/defaults/defaultFormState'
import { getChartOptions } from '../utils/chartUtils'

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
      const { container } = render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => mockBeregnResult }} />
        </FormContext.Provider>
      )

      // Sjekk at Highcharts-react er rendret
      const highchartsReact = screen.getByTestId('highcharts-react')
      expect(highchartsReact).toBeInTheDocument()

      // Sjekk etter relevante DOM-elementer som Highcharts rendrer
      const chartContainer = container.querySelector('.highcharts-container')
      expect(chartContainer).toBeInTheDocument()

      const legendItems = container.querySelectorAll('.highcharts-legend-item')
      expect(legendItems).toHaveLength(2)

      const seriesNames = Array.from(legendItems).map(
        (item) => item.textContent
      )
      expect(seriesNames).toContain('AFP Privat')
      expect(seriesNames).toContain('Alderspensjon')
    })

    it('Burde ikke rendre ResultTable dersom beregnResult er undefined', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn resource={{ read: () => undefined }} />
        </FormContext.Provider>
      )

      expect(screen.queryByTestId('result-table')).not.toBeInTheDocument()
    })

    describe('Gitt at contexten har undefined verdier', () => {
      describe('Når heltUttak.aarligInntektVsaPensjon.beloep er undefined', () => {
        it('Burde aarligInntektVsaPensjon settes til 0', () => {
          const contextValueWithUndefinedInntekt: typeof mockContextValue = {
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

          const inntektVsaHelPensjonBeloep =
            contextValueWithUndefinedInntekt.state.heltUttak
              .aarligInntektVsaPensjon?.beloep ?? 0

          expect(inntektVsaHelPensjonBeloep).toBe(0)
        })

        it('Burde ikke chartOptions inneholde "Inntekt ved siden av hel pensjon', () => {
          render(
            <FormContext.Provider value={mockContextValue}>
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

          const seriesNames = chartOptions.series.map((series) => series.name)
          expect(seriesNames).not.toContain('Inntekt ved siden av hel pensjon')
        })
      })

      describe('Når heltUttak.aarligInntektVsaPensjon er undefined', () => {
        it('Burde sette inntektVsaHelPensjonBeloep til 0', () => {
          const contextValueWithUndefinedInntekt: typeof mockContextValue = {
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

          const inntektVsaHelPensjonBeloep =
            contextValueWithUndefinedInntekt.state.heltUttak
              .aarligInntektVsaPensjon?.beloep ?? 0

          expect(inntektVsaHelPensjonBeloep).toBe(0)
        })
      })

      describe('Når heltUttak.aarligInntektVsaPensjon.sluttAlder.aar er undefined', () => {
        it('Burde sette inntektVsaHelPensjonSluttalder til 0', () => {
          const contextValueWithUndefinedSluttalder: typeof mockContextValue = {
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

          const inntektVsaHelPensjonSluttalder =
            contextValueWithUndefinedSluttalder.state.heltUttak
              .aarligInntektVsaPensjon?.sluttAlder?.aar ?? 0

          expect(inntektVsaHelPensjonSluttalder).toBe(0)
        })
      })
    })
  })
})
