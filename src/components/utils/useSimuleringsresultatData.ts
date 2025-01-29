import { useContext } from 'react'

import { Simuleringsresultat } from '@/common'
import { formatInntektToNumber } from '@/components/pages/utils/inntekt'
import { FormContext } from '@/contexts/context'

export const useSimuleringsresultatData = (
  simuleringsresultat: Simuleringsresultat | undefined
) => {
  const { state } = useContext(FormContext)

  const pensjonsalder = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []

  const afpPrivatData = simuleringsresultat
    ? simuleringsresultat?.afpPrivat?.map((item) => item.beloep)
    : []

  const gradertUttaksalder = state.gradertUttak?.uttaksalder?.aar
  const heltUttakAar = state.heltUttak.uttaksalder.aar!
  const inntektVsaHelPensjonSluttalder =
    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar

  const inntektVsaHelPensjonInterval: number[] = []
  const inntektVsaGradertUttakInterval: number[] = []
  if (gradertUttaksalder) {
    for (let i = gradertUttaksalder; i < heltUttakAar; i++) {
      inntektVsaGradertUttakInterval.push(i)
    }
  }

  const maxAar = inntektVsaHelPensjonSluttalder
    ? inntektVsaHelPensjonSluttalder
    : pensjonsalder[pensjonsalder.length - 1]

  for (let i = heltUttakAar; i <= maxAar; i++) {
    inntektVsaHelPensjonInterval.push(i)
  }

  const aarligbelopVsaGradertuttak = state.gradertUttak
    ?.aarligInntektVsaPensjonBeloep
    ? formatInntektToNumber(state.gradertUttak?.aarligInntektVsaPensjonBeloep)
    : 0
  const aarligbelopVsaHeltuttak = state.heltUttak?.aarligInntektVsaPensjon
    ?.beloep
    ? formatInntektToNumber(state.heltUttak?.aarligInntektVsaPensjon?.beloep)
    : 0

  const afpPrivatValue = (index: number) =>
    afpPrivatData && afpPrivatData.length > 0
      ? afpPrivatData[index] || afpPrivatData[afpPrivatData.length - 1]
      : 0

  const inntektVsaPensjonValue = (alder: number) =>
    inntektVsaGradertUttakInterval.includes(alder)
      ? aarligbelopVsaGradertuttak
      : inntektVsaHelPensjonInterval.includes(alder)
        ? aarligbelopVsaHeltuttak
        : 0

  const sum = (index: number, alder: number) =>
    alderspensjonData[index] +
    afpPrivatValue(index) +
    (inntektVsaGradertUttakInterval.includes(alder)
      ? aarligbelopVsaGradertuttak
      : inntektVsaHelPensjonInterval.includes(alder)
        ? aarligbelopVsaHeltuttak
        : 0)

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
