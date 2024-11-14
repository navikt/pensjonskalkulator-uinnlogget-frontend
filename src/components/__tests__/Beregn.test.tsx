import { render, screen } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import Beregn from '@/components/Beregn'
import { initialFormState } from '@/defaults/defaultFormState'

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

  it('Når simuleringsresultat er undefined, burde vise feilmelding', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <Beregn />
      </FormContext.Provider>
    )

    expect(screen.queryByText('Resultat')).not.toBeInTheDocument()
    expect(screen.getByText('Woopsy')).toBeVisible()
    expect(screen.getByText('We are having an error')).toBeVisible()
  })

  it('Når simuleringsresultat er oppgitt, burde vise tittel, resultat-table og graf', () => {
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
})
