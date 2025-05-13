import Highcharts from 'highcharts'

import {
  calculateProportionalYearlyIncome,
  formatInntektToNumber,
} from '../pages/utils/inntekt'
import { Alder, Simuleringsresultat } from '@/common'

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

  const pensjonsgivendeInntektData = extendedCategories.map((currentAge) => {
    const inntektFoerUttakBeloep = parsedAarligInntektFoerUttakBeloep

    const inntektUnderGradertUttakBeloep = parsedGradertUttakInntekt

    const inntektVedFullPensjonBeloep = parsedInntektVsaHelPensjonBeloep

    // Sjekk om gjeldende alder er innenfor en inntektsperiode
    if (
      gradertUttakAlder &&
      currentAge === gradertUttakAlder.aar &&
      gradertUttakAlder.maaneder > 0
    ) {
      // Overgangsår: Inntekt før uttak → Inntekt under gradert uttak
      return calculateProportionalYearlyIncome(
        gradertUttakAlder.maaneder,
        inntektFoerUttakBeloep,
        inntektUnderGradertUttakBeloep
      )
    } else if (
      currentAge === heltUttakAlder.aar &&
      heltUttakAlder.maaneder > 0
    ) {
      if (gradertUttakAlder) {
        // Overgangsår: Inntekt under gradert uttak → Inntekt ved siden av full pensjon
        return calculateProportionalYearlyIncome(
          heltUttakAlder.maaneder,
          inntektUnderGradertUttakBeloep,
          inntektVedFullPensjonBeloep
        )
      } else {
        // Overgangsår: Inntekt før uttak → Inntekt ved siden av full pensjon
        return calculateProportionalYearlyIncome(
          heltUttakAlder.maaneder,
          inntektFoerUttakBeloep,
          inntektVedFullPensjonBeloep
        )
      }
    } else if (
      inntektVsaHelPensjonSluttAlder &&
      currentAge === inntektVsaHelPensjonSluttAlder.aar &&
      inntektVsaHelPensjonSluttAlder.maaneder > 0
    ) {
      // Overgangsår: Inntekt ved siden av full pensjon → Ingen inntekt
      return calculateProportionalYearlyIncome(
        inntektVsaHelPensjonSluttAlder.maaneder,
        inntektVedFullPensjonBeloep,
        0
      )
    } else if (
      currentAge <
      (gradertUttakAlder ? gradertUttakAlder.aar : heltUttakAlder.aar)
    ) {
      // Helt år med inntekt før pensjon
      return inntektFoerUttakBeloep
    } else if (
      gradertUttakAlder &&
      currentAge >= gradertUttakAlder.aar &&
      currentAge < heltUttakAlder.aar
    ) {
      // Helt år med inntekt under gradert uttak
      return inntektUnderGradertUttakBeloep
    } else if (
      currentAge >= heltUttakAlder.aar &&
      (!inntektVsaHelPensjonSluttAlder ||
        currentAge < inntektVsaHelPensjonSluttAlder.aar)
    ) {
      // Helt år med inntekt ved siden av full pensjon
      return inntektVedFullPensjonBeloep
    } else {
      // Ingen inntekt (etter inntektVsaHelPensjonSluttAlder)
      return 0
    }
  })

  const xaxisCategories =
    extendedCategories.length > 0
      ? [
          ...extendedCategories.slice(0, -1),
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
      type: 'column',
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
        stacking: 'normal',
      },
    },
    series: [
      {
        name: 'Pensjonsgivende inntekt',
        data: pensjonsgivendeInntektData,
        color: 'var(--a-gray-500)',
      },
      {
        name: 'Alderspensjon (Nav)',
        data: [null, ...alderspensjonData],
        color: 'var(--a-deepblue-500)',
      },
    ],
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

    chartOptions.series.unshift({
      name: 'AFP Privat',
      data: [null, ...extendedAfpPrivatData],
      color: 'var(--a-purple-400)',
    })
  }

  return chartOptions
}
