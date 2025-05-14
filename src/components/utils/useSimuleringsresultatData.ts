import { useContext } from 'react'

import { Simuleringsresultat } from '@/common'
import {
  calculateProportionalYearlyIncome,
  formatInntektToNumber,
} from '@/components/pages/utils/inntekt'
import { FormContext } from '@/contexts/context'

export const useSimuleringsresultatData = (
  simuleringsresultat: Simuleringsresultat | undefined
) => {
  const { state } = useContext(FormContext)

  // Hent pensjonsalder fra simuleringsresultat
  const pensjonsalder = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  // Hent alderspensjonsdata fra simuleringsresultat
  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []

  // Hent AFP Privat data fra simuleringsresultat
  const afpPrivatData = simuleringsresultat
    ? simuleringsresultat?.afpPrivat?.map((item) => item.beloep)
    : []

  // Hent alle aldre og måneder for overganger
  const gradertUttaksalder = state.gradertUttak?.uttaksalder?.aar
  const gradertUttakMaaneder = state.gradertUttak?.uttaksalder?.maaneder || 0
  const heltUttakAar = state.heltUttak.uttaksalder.aar!
  const heltUttakMaaneder = state.heltUttak.uttaksalder.maaneder || 0
  const inntektVsaHelPensjonSluttAar =
    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar
  const inntektVsaHelPensjonSluttMaaneder =
    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.maaneder || 0

  // Hent inntektsbeløp
  const inntektFoerUttakBeloep = state.aarligInntektFoerUttakBeloep
    ? formatInntektToNumber(state.aarligInntektFoerUttakBeloep)
    : 0
  const aarligbelopVsaGradertuttak = state.gradertUttak
    ?.aarligInntektVsaPensjonBeloep
    ? formatInntektToNumber(state.gradertUttak?.aarligInntektVsaPensjonBeloep)
    : 0
  const aarligbelopVsaHeltuttak = state.heltUttak?.aarligInntektVsaPensjon
    ?.beloep
    ? formatInntektToNumber(state.heltUttak?.aarligInntektVsaPensjon?.beloep)
    : 0

  // Intervall for inntekt ved gradert uttak
  const inntektVsaGradertUttakInterval: number[] = []
  const inntektVsaHelPensjonInterval: number[] = []

  if (gradertUttaksalder) {
    for (let i = gradertUttaksalder; i < heltUttakAar; i++) {
      inntektVsaGradertUttakInterval.push(i)
    }
  }

  // Beregn maks alder for inntekt ved hel pensjon
  const maxAar = inntektVsaHelPensjonSluttAar
    ? inntektVsaHelPensjonSluttAar
    : pensjonsalder[pensjonsalder.length - 1]

  for (let i = heltUttakAar; i <= maxAar; i++) {
    inntektVsaHelPensjonInterval.push(i)
  }

  // Hent AFP Privat verdi for en gitt indeks
  const afpPrivatValue = (index: number) =>
    afpPrivatData && afpPrivatData.length > 0
      ? afpPrivatData[index] || afpPrivatData[afpPrivatData.length - 1]
      : 0

  // Beregn inntekt ved pensjon for en gitt alder
  const inntektVsaPensjonValue = (alder: number) => {
    // Håndter overgang fra initial inntekt til gradert uttak
    if (
      gradertUttaksalder &&
      alder === gradertUttaksalder &&
      gradertUttakMaaneder > 0
    ) {
      return calculateProportionalYearlyIncome(
        gradertUttakMaaneder,
        inntektFoerUttakBeloep,
        aarligbelopVsaGradertuttak
      )
    }
    // Håndter overgang fra gradert uttak til hel pensjon
    else if (alder === heltUttakAar && heltUttakMaaneder > 0) {
      if (gradertUttaksalder) {
        return calculateProportionalYearlyIncome(
          heltUttakMaaneder,
          aarligbelopVsaGradertuttak,
          aarligbelopVsaHeltuttak
        )
      } else {
        return calculateProportionalYearlyIncome(
          heltUttakMaaneder,
          inntektFoerUttakBeloep,
          aarligbelopVsaHeltuttak
        )
      }
    }
    // Håndter overgang fra hel pensjon til ingen inntekt
    else if (
      inntektVsaHelPensjonSluttAar &&
      alder === inntektVsaHelPensjonSluttAar &&
      inntektVsaHelPensjonSluttMaaneder > 0
    ) {
      return calculateProportionalYearlyIncome(
        inntektVsaHelPensjonSluttMaaneder,
        aarligbelopVsaHeltuttak,
        0
      )
    }
    // Vanlige inntektsperioder (ikke-overgang)
    else if (
      gradertUttaksalder &&
      alder >= gradertUttaksalder &&
      alder < heltUttakAar
    ) {
      return aarligbelopVsaGradertuttak
    }
    // helt uttak period
    else if (
      alder >= heltUttakAar &&
      (!inntektVsaHelPensjonSluttAar || alder <= inntektVsaHelPensjonSluttAar)
    ) {
      return aarligbelopVsaHeltuttak
    } else {
      return 0
    }
  }

  // Beregn summen av alderspensjon, AFP Privat og inntekt ved pensjon
  const sum = (index: number, alder: number) =>
    alderspensjonData[index] +
    afpPrivatValue(index) +
    inntektVsaPensjonValue(alder)

  return {
    state,
    pensjonsalder,
    alderspensjonData,
    afpPrivatData,
    inntektVsaGradertUttakInterval,
    inntektVsaHelPensjonInterval,
    aarligbelopVsaGradertuttak,
    aarligbelopVsaHeltuttak,
    afpPrivatValue,
    inntektVsaPensjonValue,
    sum,
  }
}
