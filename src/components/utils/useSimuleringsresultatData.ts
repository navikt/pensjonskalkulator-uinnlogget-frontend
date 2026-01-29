import { useContext, useMemo } from 'react'

import { Simuleringsresultat, State } from '@/common'
import {
  beregnInntektForAlder,
  parseInntekt,
} from '@/components/pages/utils/inntekt'
import { FormContext } from '@/contexts/context'

export interface UseSimuleringsresultatDataResult {
  state: State
  pensjonsalder: number[]
  alderspensjonData: number[]
  afpPrivatData: number[]
  afpPrivatValue: (index: number) => number
  inntektVsaPensjonValue: (alder: number) => number
  sum: (index: number, alder: number) => number
}

export const useSimuleringsresultatData = (
  simuleringsresultat: Simuleringsresultat | undefined
): UseSimuleringsresultatDataResult => {
  const { state } = useContext(FormContext)

  const pensjonsalder = useMemo(
    () => simuleringsresultat?.alderspensjon.map((item) => item.alder) ?? [],
    [simuleringsresultat]
  )

  const alderspensjonData = useMemo(
    () => simuleringsresultat?.alderspensjon.map((item) => item.beloep) ?? [],
    [simuleringsresultat]
  )

  const afpPrivatData = useMemo(
    () => simuleringsresultat?.afpPrivat?.map((item) => item.beloep) ?? [],
    [simuleringsresultat]
  )

  const afpPrivatValue = (index: number): number => {
    if (afpPrivatData.length === 0) return 0
    return afpPrivatData[index] ?? afpPrivatData[afpPrivatData.length - 1] ?? 0
  }

  const inntektVsaPensjonValue = (alder: number): number => {
    return beregnInntektForAlder({
      alder,
      gradertUttakAar: state.gradertUttak?.uttaksalder?.aar ?? undefined,
      gradertUttakMaaneder: state.gradertUttak?.uttaksalder?.maaneder ?? 0,
      heltUttakAar: state.heltUttak.uttaksalder.aar ?? 0,
      heltUttakMaaneder: state.heltUttak.uttaksalder.maaneder ?? 0,
      inntektSluttAar:
        state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar ?? undefined,
      inntektSluttMaaneder:
        state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.maaneder ?? 0,
      inntektFoerUttak: parseInntekt(state.aarligInntektFoerUttakBeloep),
      inntektVedGradertUttak: parseInntekt(
        state.gradertUttak?.aarligInntektVsaPensjonBeloep
      ),
      inntektVedHeltUttak: parseInntekt(
        state.heltUttak?.aarligInntektVsaPensjon?.beloep
      ),
    })
  }

  const sum = (index: number, alder: number): number => {
    const alderspensjon = alderspensjonData[index] ?? 0
    return alderspensjon + afpPrivatValue(index) + inntektVsaPensjonValue(alder)
  }

  return {
    state,
    pensjonsalder,
    alderspensjonData,
    afpPrivatData,
    afpPrivatValue,
    inntektVsaPensjonValue,
    sum,
  }
}
