import { getChartOptions } from '../chartUtils'

describe('getChartOptions', () => {
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

  it('Burde returnere korrekt chartOptions når alle parameterne er angitt', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonBeloep = 100000
    const inntektVsaHelPensjonSluttalder = 72

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      mockBeregnResult
    )

    expect(chartOptions.chart.type).toBe('column')
    expect(chartOptions.title.text).toBe(
      'Beregnet framtidig alderspensjon (kroner per år):'
    )
    expect(chartOptions.xAxis.categories).toEqual([67, 68])
    expect(chartOptions.series).toEqual([
      { name: 'AFP Privat', data: [50000, 55000] },
      { name: 'Alderspensjon', data: [200000, 210000] },
      { name: 'Inntekt ved siden av hel pensjon', data: [100000, 100000] },
    ])
  })

  it('Burde håndtere dersom det ikke er sluttalder på inntekt ved siden av hel pensjon', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 0
    const inntektVsaHelPensjonBeloep = 100000

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      mockBeregnResult
    )

    expect(chartOptions.series).toContainEqual({
      name: 'Inntekt ved siden av hel pensjon',
      data: [100000, 100000],
    })
  })

  it('Burde håndtere inntektVsaHelPensjonBeloep dersom den er 0', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 72
    const inntektVsaHelPensjonBeloep = 0

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      mockBeregnResult
    )

    expect(chartOptions.series).not.toContainEqual({
      name: 'Inntekt ved siden av hel pensjon',
      data: expect.any(Array),
    })
  })

  it('Burde håndtere tom beregnResult', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 72
    const inntektVsaHelPensjonBeloep = 100000
    const emptyBeregnResult = {
      alderspensjon: [],
      afpPrivat: [],
      afpOffentlig: [],
      vilkaarsproeving: {
        vilkaarErOppfylt: false,
        alternativ: {
          heltUttaksalder: { aar: 0, maaneder: 0 },
          gradertUttaksalder: { aar: 0, maaneder: 0 },
          uttaksgrad: 0,
        },
      },
    }

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      emptyBeregnResult
    )

    expect(chartOptions.xAxis.categories).toEqual([])
    expect(chartOptions.series).toEqual([
      { name: 'AFP Privat', data: [] },
      { name: 'Alderspensjon', data: [] },
      { name: 'Inntekt ved siden av hel pensjon', data: [] },
    ])
  })

  it('Burde håndtere undefined beregnResult', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 72
    const inntektVsaHelPensjonBeloep = 100000
    const undefinedBeregnResult = undefined

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      undefinedBeregnResult
    )

    expect(chartOptions.xAxis.categories).toEqual([])
    expect(chartOptions.series).toEqual([
      { name: 'AFP Privat', data: [] },
      { name: 'Alderspensjon', data: [] },
      { name: 'Inntekt ved siden av hel pensjon', data: [] },
    ])
  })

  it('Burde håndtere filteredInntektVsaHelPensjonData riktig', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 68
    const inntektVsaHelPensjonBeloep = 100000

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      mockBeregnResult
    )

    const filteredInntektVsaHelPensjonData = [100000, 100000]

    expect(chartOptions.series).toContainEqual({
      name: 'Inntekt ved siden av hel pensjon',
      data: filteredInntektVsaHelPensjonData,
    })
  })

  it('Burde håndtere filteredCategories riktig', () => {
    const heltUttakAlder = 67
    const inntektVsaHelPensjonSluttalder = 68
    const inntektVsaHelPensjonBeloep = 0

    const chartOptions = getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      mockBeregnResult
    )

    const filteredCategories = [67, 68]
    const filteredInntektVsaHelPensjonData = filteredCategories.map(
      (category) =>
        filteredCategories.includes(category) ? inntektVsaHelPensjonBeloep : 0
    )

    console.log(filteredInntektVsaHelPensjonData)

    expect(chartOptions.series).not.toContainEqual({
      name: 'Inntekt ved siden av hel pensjon',
      data: filteredInntektVsaHelPensjonData,
    })
  })
})
