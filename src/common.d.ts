import type { components } from './types/schema.d.ts'

/* export type FormValues = {
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
} */

export type SchemaFormValues = components['schemas']['AnonymSimuleringSpecV1']

export type FormValues = SchemaFormValues & {
  boddIUtland: string // fjernes fra ApiPayloaden
  inntektVsaHelPensjon: string // fjernes fra ApiPayloaden
}

export type FormValueResult = components['schemas']['AnonymSimuleringResultV1']

export interface ContextForm {
  states: FormValues
  setState: Dispatch<React.SetStateAction<FormValues>>
  formPageProps: FormPageProps
}

export interface StepRef {
  onSubmit: () => void
}

export interface PensjonData {
  alderspensjon: { alder: number; beloep: number }[]
  afpPrivat: { alder: number; beloep: number }[]
  afpOffentlig: { alder: number; beloep: number }[]
  vilkaarsproeving: {
    vilkaarErOppfylt: boolean
    alternativ: number | string | null
  } // Hva er alternativ?
}

export interface FormPageProps {
  curStep: number
  length: number
  goBack: () => void
  onStepChange: (step: number) => void
  handleSubmit: () => void
  goToNext: () => void
}
