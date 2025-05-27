import { State } from '@/common'

export const initialState: State = {
  simuleringstype: undefined,
  foedselAar: null,
  sivilstand: undefined,
  epsHarInntektOver2G: undefined,
  epsHarPensjon: undefined,
  harBoddIUtland: null,
  harInntektVsaHelPensjon: null,
  utenlandsAntallAar: undefined,
  inntektOver1GAntallAar: null,
  aarligInntektFoerUttakBeloep: null,
  gradertUttak: {
    grad: null,
    uttaksalder: {
      aar: null,
      maaneder: null,
    },
  },
  heltUttak: {
    uttaksalder: {
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
  aldersgrense: {
    normertPensjoneringsalder: {
      aar: null,
      maaneder: null,
    },
    nedreAldersgrense: {
      aar: null,
      maaneder: null,
    },
  },
}
