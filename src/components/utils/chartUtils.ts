import { Simuleringsresultat } from '@/common'

const alignData = (
  categories: number[],
  interval: number[],
  beloep: number | null
) => {
  // Filtrerer kategorier for å inkludere kun de som er i intervallet
  const filteredCategories = categories.filter((category) =>
    interval.includes(category)
  )

  //Lager et array av samme lengde som filteredCategories, og fyller det med beloep
  const filteredData = filteredCategories
    .map(() => beloep)
    .filter((beloep): beloep is number => beloep !== null)

  //Initialiserer et array av samme lengde som categories, og fyller det med null
  const alignedData = new Array(categories.length).fill(null)

  //For hver filtrerte kategori, finn indeksen i categories og sett beloepet i alignedData
  filteredCategories.forEach((category, index) => {
    const categoryIndex = categories.indexOf(category)
    if (categoryIndex !== -1) {
      alignedData[categoryIndex] = filteredData[index]
    }
  })

  return alignedData
}

export const getChartOptions = (input: {
  simuleringsresultat?: Simuleringsresultat
  aarligInntektFoerUttakBeloep?: number
  heltUttakAar: number
  inntektVsaHelPensjonSluttalder?: number | null
  inntektVsaHelPensjonBeloep?: number | null
  gradertUttakAlder?: number | null
  gradertUttakInntekt?: number | null
}) => {
  const {
    simuleringsresultat,
    aarligInntektFoerUttakBeloep = 0,
    heltUttakAar,
    inntektVsaHelPensjonSluttalder = 0,
    inntektVsaHelPensjonBeloep = 0,
    gradertUttakAlder = 0,
    gradertUttakInntekt = 0,
  } = input

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []
  const afpPrivatData =
    simuleringsresultat?.afpPrivat?.map((item) => item.beloep) ?? []
  //Nå mappes categories til alder, og vi får en liste av alder, men på første element så skal vi ha categories[0] - 1
  const categories = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  // Legger til et ekstra element for Pensjonsgivende Inntekt i begynnelsen av categories
  const extendedCategories =
    categories.length > 0 ? [categories[0] - 1, ...categories] : []

  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Beregnet framtidig alderspensjon (kroner per år):',
    },
    xAxis: {
      categories: extendedCategories,
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
        name: 'Pensjonsgivende inntekt',
        data: [
          aarligInntektFoerUttakBeloep,
          new Array(categories.length).fill(null),
        ].flat(),
        color: 'var(--a-gray-500)',
      },
      {
        name: 'Alderspensjon',
        data: [null, ...alderspensjonData],
        color: 'var(--a-deepblue-500)',
      },
    ],
  }

  if (afpPrivatData.length !== 0) {
    chartOptions.series.unshift({
      name: 'AFP Privat',
      data: [null, ...afpPrivatData],
      color: 'var(--a-purple-400)',
    })
  }

  if (inntektVsaHelPensjonBeloep !== 0 || inntektVsaHelPensjonBeloep) {
    const maxAar = inntektVsaHelPensjonSluttalder
      ? inntektVsaHelPensjonSluttalder
      : categories[categories.length - 1]

    const inntektVsaHelPensjonInterval = []
    for (let i = heltUttakAar; i <= maxAar; i++) {
      inntektVsaHelPensjonInterval.push(i)
    }

    const alignedInntektVsaHelPensjonData = alignData(
      categories,
      inntektVsaHelPensjonInterval,
      inntektVsaHelPensjonBeloep
    )

    chartOptions.series.push({
      name: 'Inntekt ved siden av hel pensjon',
      data: [null, ...alignedInntektVsaHelPensjonData],
      color: 'var(--a-green-400)',
    })
  }

  if (gradertUttakInntekt !== 0 || gradertUttakInntekt) {
    const gradertUttakInterval = []
    for (let i = gradertUttakAlder!; i < heltUttakAar; i++) {
      gradertUttakInterval.push(i)
    }

    const alignedGradertUttakData = alignData(
      categories,
      gradertUttakInterval,
      gradertUttakInntekt
    )

    chartOptions.series.push({
      name: 'Inntekt ved siden av gradert pensjon',
      data: [null, ...alignedGradertUttakData],
      color: 'var(--a-gray-500)',
    })
  }

  return chartOptions
}
