export type FormValues = {
  simuleringType: string,
  foedselAar: number,
  sivilstand: string,
  epsHarInntektOver2G: boolean,
  epsHarPensjon: boolean,
  utenlandsAntallAar: number,
  inntektOver1GAntallAar: number,
  aarligInntektFoerUttakBeloep: number,
  gradertUttak: {
    grad: number
    uttakAlder: {
      aar: number
      maaneder: number
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
