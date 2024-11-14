import { Simuleringsresultat } from '@/common'

export const getChartOptions = (input: {
  simuleringsresultat: Simuleringsresultat | undefined
  heltUttakAar: number
  inntektVsaHelPensjonSluttalder?: number
  inntektVsaHelPensjonBeloep?: number
}) => {
  const {
    simuleringsresultat,
    heltUttakAar,
    inntektVsaHelPensjonSluttalder = 0,
    inntektVsaHelPensjonBeloep = 0,
  } = input

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []
  const afpPrivatData =
    simuleringsresultat?.afpPrivat?.map((item) => item.beloep) ?? []
  const categories = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Beregnet framtidig alderspensjon (kroner per år):',
    },
    xAxis: {
      categories: categories,
      title: {
        text: 'Alder',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Beløp (i kr)',
      },
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },
    series: [
      {
        name: 'AFP Privat',
        data: afpPrivatData,
      },
      {
        name: 'Alderspensjon',
        data: alderspensjonData,
      },
    ],
  }

  if (
    inntektVsaHelPensjonBeloep !== 0 &&
    inntektVsaHelPensjonBeloep !== undefined
  ) {
    const inntektVsaHelPensjonData = []
    const inntektVsaHelPensjonInterval: number[] = []

    const maxAar = inntektVsaHelPensjonSluttalder
      ? inntektVsaHelPensjonSluttalder
      : categories[categories.length - 1]

    for (let i = heltUttakAar; i <= maxAar; i++) {
      inntektVsaHelPensjonData.push(inntektVsaHelPensjonBeloep)
      inntektVsaHelPensjonInterval.push(i)
    }

    const filteredCategories = categories.filter((category) =>
      inntektVsaHelPensjonInterval.includes(category)
    )

    const filteredInntektVsaHelPensjonData = filteredCategories.map(
      () => inntektVsaHelPensjonBeloep
    )

    chartOptions.series.push({
      name: 'Inntekt ved siden av hel pensjon',
      data: filteredInntektVsaHelPensjonData,
    })
  }

  return chartOptions
}
