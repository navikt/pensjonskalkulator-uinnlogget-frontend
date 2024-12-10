import Beregn from '@/components/Beregn'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import { render, screen } from '@testing-library/react'

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

jest.mock('../ResponseWarning', () =>
  jest.fn(() => <div>Mocked ResponseWarning</div>)
)

const mockSimuleringsresultat = {
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
  },
}

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()
const mockGoTo = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  goTo: mockGoTo,
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: initialState,
  setState: mockSetState,
  formPageProps: defaultFormPageProps,
}

describe('Beregn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Når simuleringsresultat er undefined, burde vise feilmelding', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <Beregn />
      </FormContext.Provider>
    )

    expect(screen.getByText('Mocked ResponseWarning')).toBeInTheDocument()
    expect(screen.queryByText('Resultat')).not.toBeInTheDocument()
  })

  test('Når simuleringsresultat er oppgitt, burde vise tittel, resultat-table og graf', () => {
    const { container } = render(
      <FormContext.Provider value={mockContextValue}>
        <Beregn simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )

    expect(screen.getByText('Resultat')).toBeVisible()
    expect(screen.getByTestId('result-table')).toBeVisible()
    const highchartsReact = screen.getByTestId('highcharts-react')
    expect(highchartsReact).toBeInTheDocument()

    // Sjekk etter relevante DOM-elementer som Highcharts rendrer
    const chartContainer = container.querySelector('.highcharts-container')
    expect(chartContainer).toBeInTheDocument()

    const legendItems = container.querySelectorAll('.highcharts-legend-item')
    expect(legendItems).toHaveLength(2)

    const seriesNames = Array.from(legendItems).map((item) => item.textContent)
    expect(seriesNames).toContain('AFP Privat')
    expect(seriesNames).toContain('Alderspensjon')
  })

  describe('Når simuleringsresultat er oppgitt og parameterene til getChartOptions parses', () => {
    it('Burde grafen bli rendret med riktig data', () => {
      mockContextValue.state = {
        ...initialState,
        aarligInntektFoerUttakBeloep: '50000',
        heltUttak: {
          uttaksalder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjon: {
            sluttAlder: { aar: 70, maaneder: 0 },
            beloep: '30000',
          },
        },
        gradertUttak: {
          grad: 50,
          uttaksalder: { aar: 62, maaneder: 0 },
          aarligInntektVsaPensjonBeloep: '20000',
        },
      }

      const { container } = render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn simuleringsresultat={mockSimuleringsresultat} />
        </FormContext.Provider>
      )

      expect(screen.getByText('Resultat')).toBeVisible()
      expect(screen.getByTestId('result-table')).toBeVisible()
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
      //expect(seriesNames).toContain('Pensjonsgivende inntekt')
    })
  })
  describe('Gitt at brukeren har lyst til å endre opplysninger', () => {
    test('Burde knappen for å endre opplysninger være klikkbar', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn simuleringsresultat={mockSimuleringsresultat} />
        </FormContext.Provider>
      )

      const endreOpplysningerButton = screen.getByText('Endre opplysninger')
      expect(endreOpplysningerButton).toBeVisible()
    })
    test('Burde navigere tilbake til første steg når knappen for å endre opplysninger blir klikket', () => {
      render(
        <FormContext.Provider value={mockContextValue}>
          <Beregn simuleringsresultat={mockSimuleringsresultat} />
        </FormContext.Provider>
      )

      const endreOpplysningerButton = screen.getByText('Endre opplysninger')
      endreOpplysningerButton.click()

      expect(mockGoTo).toHaveBeenCalledWith(0)
    })
  })
})
