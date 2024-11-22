import { Simuleringsresultat } from '@/common'

export const getChartOptions = (input: {
  simuleringsresultat: Simuleringsresultat | undefined
  heltUttakAar: number
  inntektVsaHelPensjonSluttalder?: number | null
  inntektVsaHelPensjonBeloep?: number | null
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
    console.log(maxAar)

    for (let i = heltUttakAar; i <= maxAar; i++) {
      inntektVsaHelPensjonData.push(inntektVsaHelPensjonBeloep)
      inntektVsaHelPensjonInterval.push(i)
    }

    const filteredCategories = categories.filter((category) =>
      inntektVsaHelPensjonInterval.includes(category)
    )

    const filteredInntektVsaHelPensjonData = filteredCategories
      .map(() => inntektVsaHelPensjonBeloep)
      .filter((value): value is number => value !== null)

    // Create an array of the same length as categories filled with null
    const alignedInntektVsaHelPensjonData = new Array(categories.length).fill(
      null
    )

    // Place the filtered data at the correct indices
    filteredCategories.forEach((category, index) => {
      const categoryIndex = categories.indexOf(category)
      if (categoryIndex !== -1) {
        alignedInntektVsaHelPensjonData[categoryIndex] =
          filteredInntektVsaHelPensjonData[index]
      }
    })

    chartOptions.series.push({
      name: 'Inntekt ved siden av hel pensjon',
      data: alignedInntektVsaHelPensjonData,
    })
  }

  return chartOptions
}
