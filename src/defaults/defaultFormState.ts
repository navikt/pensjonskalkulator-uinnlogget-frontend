import { State } from '@/common'

export const initialState: State = {
  simuleringType: undefined,
  foedselAar: null,
  sivilstand: undefined,
  epsHarInntektOver2G: undefined,
  epsHarPensjon: undefined,
  boddIUtland: null,
  harInntektVsaHelPensjon: null,
  utenlandsAntallAar: undefined,
  inntektOver1GAntallAar: undefined,
  aarligInntektFoerUttakBeloep: undefined,
  gradertUttak: {
    grad: null,
    uttakAlder: {
      aar: null,
      maaneder: null,
    },
    aarligInntektVsaPensjonBeloep: null,
  },
  heltUttak: {
    uttakAlder: {
      aar: null,
      maaneder: null,
    },
    aarligInntektVsaPensjon: {
      beloep: null,
      sluttAlder: {
        aar: null,
        maaneder: null,
      },
    },
  },
}
