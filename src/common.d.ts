export type FormValues = {
  simuleringType: string | null,
  foedselAar: number,
  sivilstand: string,
  epsHarInntektOver2G?: boolean | null,
  epsHarPensjon?: boolean | null,
  boddIUtland: string, // fjernes fra ApiPayloaded
  inntektVsaHelPensjon: string, // fjernes fra ApiPayloaded
  utenlandsAntallAar: number,
  inntektOver1GAntallAar: number,
  aarligInntektFoerUttakBeloep: number,
  gradertUttak: {
    grad: number
    uttakAlder: {
      aar?: number | null,
      maaneder?: number | null
    },
    aarligInntektVsaPensjonBeloep: number
  }
  heltUttak: {
    uttakAlder: {
      aar: number,
      maaneder: number
    },
    aarligInntektVsaPensjon: {
      beloep: number,
      sluttAlder: {
        aar?: number | null,
        maaneder?: number | null
      }
    }
  }
}

export interface ContextForm {
  states: FormValues
  setState: Dispatch<React.SetStateAction<FormValues>>
}

export interface StepRef {
  onSubmit: () => void
}
