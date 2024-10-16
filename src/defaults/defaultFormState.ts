import { State } from '@/common'

export const initialFormState: State = {
  simuleringType: '',
  foedselAar: 0,
  sivilstand: 'UGIFT',
  epsHarInntektOver2G: undefined,
  epsHarPensjon: undefined,
  boddIUtland: '', // fjernes fra ApiPayloaded
  inntektVsaHelPensjon: '', // fjernes fra ApiPayloaded
  utenlandsAntallAar: 0,
  inntektOver1GAntallAar: 0, //Spør espen om dette. Hva er denne verdien og hvilket intervall kan den være mellom. Fiks useErrorHandling.ts i henhold til dette.
  aarligInntektFoerUttakBeloep: 0,
  gradertUttak: {
    grad: 0,
    uttakAlder: {
      aar: 0,
      maaneder: -1,
    },
    aarligInntektVsaPensjonBeloep: 0,
  },
  heltUttak: {
    uttakAlder: {
      aar: 0,
      maaneder: -1,
    },
    aarligInntektVsaPensjon: {
      beloep: 0,
      sluttAlder: {
        aar: 0,
        maaneder: -1,
      },
    },
  },
}
