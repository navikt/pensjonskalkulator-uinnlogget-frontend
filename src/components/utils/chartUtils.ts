import { Simuleringsresultat } from '@/common'
import { formatInntektToNumber } from '../pages/utils/inntekt'

export const alignData = (
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
  aarligInntektFoerUttakBeloep?: string
  heltUttakAar: number
  inntektVsaHelPensjonSluttalder?: number | null
  inntektVsaHelPensjonBeloep?: string | null
  gradertUttakAlder?: number | null
  gradertUttakInntekt?: string | null
}) => {
  const {
    simuleringsresultat,
    aarligInntektFoerUttakBeloep,
    heltUttakAar,
    inntektVsaHelPensjonSluttalder = 0,
    inntektVsaHelPensjonBeloep,
    gradertUttakAlder = 0,
    gradertUttakInntekt,
  } = input

  const parsedAarligInntektFoerUttakBeloep = isNaN(
    formatInntektToNumber(aarligInntektFoerUttakBeloep)
  )
    ? 0
    : formatInntektToNumber(aarligInntektFoerUttakBeloep)
  const parsedInntektVsaHelPensjonBeloep = isNaN(
    formatInntektToNumber(inntektVsaHelPensjonBeloep)
  )
    ? 0
    : formatInntektToNumber(inntektVsaHelPensjonBeloep)
  const parsedGradertUttakInntekt = isNaN(
    formatInntektToNumber(gradertUttakInntekt)
  )
    ? 0
    : formatInntektToNumber(gradertUttakInntekt)

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []
  const afpPrivatData =
    simuleringsresultat?.afpPrivat?.map((item) => item.beloep) ?? []

  const categories = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

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
          parsedAarligInntektFoerUttakBeloep,
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

  const inntektPlacement = afpPrivatData.length !== 0 ? 1 : 0

  if (
    parsedInntektVsaHelPensjonBeloep !== 0 ||
    parsedInntektVsaHelPensjonBeloep
  ) {
    const maxAar = inntektVsaHelPensjonSluttalder
      ? inntektVsaHelPensjonSluttalder
      : categories[categories.length - 1]

    const inntektVsaHelPensjonInterval = []
    for (let i = heltUttakAar; i <= maxAar; i++) {
      inntektVsaHelPensjonInterval.push(i)
    }

    const alignedInntektVsaHelPensjonData = alignData(
      extendedCategories,
      inntektVsaHelPensjonInterval,
      parsedInntektVsaHelPensjonBeloep
    )

    chartOptions.series[inntektPlacement].data = chartOptions.series[
      inntektPlacement
    ].data.map((value, index) =>
      value !== null ? value : alignedInntektVsaHelPensjonData[index]
    )
  }

  if (parsedGradertUttakInntekt !== 0 || parsedGradertUttakInntekt) {
    const gradertUttakInterval = []
    for (let i = gradertUttakAlder!; i < heltUttakAar; i++) {
      gradertUttakInterval.push(i)
    }

    const alignedGradertUttakData = alignData(
      extendedCategories,
      gradertUttakInterval,
      parsedGradertUttakInntekt
    )

    chartOptions.series[inntektPlacement].data = chartOptions.series[
      inntektPlacement
    ].data.map((value, index) =>
      value !== null ? value : alignedGradertUttakData[index]
    )
  }

  return chartOptions
}
