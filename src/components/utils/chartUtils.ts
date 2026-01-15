import Highcharts from 'highcharts'

import { beregnInntektForAlder, parseInntekt } from '../pages/utils/inntekt'
import { Alder, Simuleringsresultat } from '@/common'

export const alignData = (
  categories: number[],
  interval: number[],
  beloep: number | null
) => {
  // * Filtrerer kategorier for å inkludere kun de som er i intervallet
  const filteredCategories = categories.filter((category) =>
    interval.includes(category)
  )

  // * Lager et array av samme lengde som filteredCategories, og fyller det med beloep
  const filteredData = filteredCategories
    .map(() => beloep)
    .filter((beloep): beloep is number => beloep !== null)

  // * Initialiserer et array av samme lengde som categories, og fyller det med null
  const alignedData = new Array(categories.length).fill(null)

  // * For hver filtrerte kategori, finn indeksen i categories og sett beloepet i alignedData
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
  heltUttakAlder: Alder
  inntektVsaHelPensjonSluttAlder?: Alder | null
  inntektVsaHelPensjonBeloep?: string | null
  gradertUttakAlder?: Alder | null
  gradertUttakInntekt?: string | null
}) => {
  const {
    simuleringsresultat,
    aarligInntektFoerUttakBeloep,
    heltUttakAlder,
    inntektVsaHelPensjonSluttAlder = null,
    inntektVsaHelPensjonBeloep,
    gradertUttakAlder = null,
    gradertUttakInntekt,
  } = input

  const inntektFoerUttak = parseInntekt(aarligInntektFoerUttakBeloep)
  const inntektVedHeltUttak = parseInntekt(inntektVsaHelPensjonBeloep)
  const inntektVedGradertUttak = parseInntekt(gradertUttakInntekt)

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

  const pensjonsgivendeInntektData =
    extendedCategories.length > 0
      ? extendedCategories.map((alder, index) => {
          // Første rad (før uttak) viser alltid inntektFoerUttak
          if (index === 0) {
            return inntektFoerUttak
          }
          return beregnInntektForAlder({
            alder,
            gradertUttakAar: gradertUttakAlder?.aar,
            gradertUttakMaaneder: gradertUttakAlder?.maaneder ?? 0,
            heltUttakAar: heltUttakAlder.aar,
            heltUttakMaaneder: heltUttakAlder.maaneder,
            inntektSluttAar: inntektVsaHelPensjonSluttAlder?.aar,
            inntektSluttMaaneder: inntektVsaHelPensjonSluttAlder?.maaneder ?? 0,
            inntektFoerUttak,
            inntektVedGradertUttak,
            inntektVedHeltUttak,
          })
        })
      : [inntektFoerUttak]

  const xaxisCategories =
    extendedCategories.length > 0
      ? [
          ...extendedCategories.slice(0, -1).map(String),
          `${extendedCategories[extendedCategories.length - 1]}+`,
        ]
      : []

  Highcharts.setOptions({
    lang: {
      numericSymbols: [],
    },
  })

  const chartOptions = {
    chart: {
      type: 'column' as const,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: xaxisCategories,
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
        stacking: 'normal' as const,
      },
    },
    series: [
      {
        type: 'column' as const,
        name: 'Pensjonsgivende inntekt',
        data: pensjonsgivendeInntektData as (number | null)[],
        color: 'var(--a-gray-500)',
      },
    ] as Highcharts.SeriesOptionsType[],
  }

  if (afpPrivatData.length !== 0) {
    const extendedAfpPrivatData =
      afpPrivatData.length < alderspensjonData.length
        ? [
            ...afpPrivatData,
            ...new Array(alderspensjonData.length - afpPrivatData.length).fill(
              afpPrivatData[afpPrivatData.length - 1]
            ),
          ]
        : afpPrivatData

    chartOptions.series.push({
      type: 'column' as const,
      name: 'AFP Privat',
      data: [null, ...extendedAfpPrivatData],
      color: 'var(--a-purple-400)',
    })
  }

  chartOptions.series.push({
    type: 'column' as const,
    name: 'Alderspensjon (Nav)',
    data: [null, ...alderspensjonData],
    color: 'var(--a-deepblue-500)',
  })

  return chartOptions
}
