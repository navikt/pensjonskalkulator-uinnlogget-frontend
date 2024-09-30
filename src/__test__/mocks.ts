import { FormValues } from '@/common';

export const mockStates: FormValues = {
    simuleringType: null,
    foedselAar: 0,
    sivilstand: "UGIFT",
    epsHarInntektOver2G: null,
    epsHarPensjon: null,
    boddIUtland: "",
    inntektVsaHelPensjon: "",
    utenlandsAntallAar: 0,
    inntektOver1GAntallAar: 0,
    aarligInntektFoerUttakBeloep: 0,
    gradertUttak: {
      grad: 0,
      uttakAlder: {
        aar: null,
        maaneder: null,
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
          aar: null,
          maaneder: null,
        },
      },
    },
  };

export const mockSetState = jest.fn();