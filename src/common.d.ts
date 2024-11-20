import type { components } from './types/schema.d.ts'

export type APIPayload = components['schemas']['AnonymSimuleringSpecV1']

export type State = Omit<
  ApiPayload,
  'foedselAar' | 'gradertUttak' | 'heltUttak'
> &
  AdditionalInputTypes

export type OptionalGradertUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['gradertUttak'],
  'grad' | 'uttakAlder' | 'aarligInntektVsaPensjonBeloep'
> & {
  grad:
    | null
    | components['schemas']['AnonymSimuleringSpecV1']['gradertUttak']['grad']
  uttakAlder: null | {
    aar:
      | null
      | components['schemas']['AnonymSimuleringSpecV1']['gradertUttak']['uttakAlder']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringSpecV1']['gradertUttak']['uttakAlder']['maaneder']
  }
  aarligInntektVsaPensjonBeloep:
    | null
    | components['schemas']['AnonymSimuleringSpecV1']['gradertUttak']['aarligInntektVsaPensjonBeloep']
}

export type OptionalHeltUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['heltUttak'],
  'uttakAlder' | 'aarligInntektVsaPensjon'
> & {
  uttakAlder: null | {
    aar:
      | null
      | components['schemas']['AnonymSimuleringSpecV1']['heltUttak']['uttakAlder']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringSpecV1']['heltUttak']['uttakAlder']['maaneder']
  }
  aarligInntektVsaPensjon:
    | undefined
    | {
        beloep:
          | null
          | components['schemas']['AnonymSimuleringSpecV1']['heltUttak']['aarligInntektVsaPensjon']['beloep']
        sluttAlder:
          | undefined
          | {
              aar:
                | null
                | components['schemas']['AnonymSimuleringSpecV1']['heltUttak']['aarligInntektVsaPensjon']['sluttAlder']['aar']
              maaneder:
                | null
                | components['schemas']['AnonymSimuleringSpecV1']['heltUttak']['aarligInntektVsaPensjon']['sluttAlder']['maaneder']
            }
      }
}

export type BooleanRadio = 'ja' | 'nei'

type AdditionalInputTypes = {
  foedselAar:
    | null
    | components['schemas']['AnonymSimuleringSpecV1']['foedselAar']
  gradertUttak?: OptionalGradertUttak
  heltUttak: OptionalHeltUttak
  boddIUtland: BooleanRadio | null
  harInntektVsaHelPensjon: string | null
}

export type Simuleringsresultat =
  components['schemas']['AnonymSimuleringResultV1']

export type StepName =
  | 'AlderStep'
  | 'UtlandsStep'
  | 'InntektStep'
  | 'EktefelleStep'
  | 'AFPStep'

export type ErrorFields = {
  foedselAar?: string
  inntektOver1GAntallAar?: string
  boddIUtland?: string
  utenlandsAntallAar?: string
  aarligInntektFoerUttakBeloep?: string
  uttaksgrad?: string
  gradertInntekt?: string
  gradertAar?: string
  gradertMaaneder?: string
  heltUttakAar?: string
  heltUttakMaaneder?: string
  helPensjonInntekt?: string
  heltUttakSluttAlderMaaneder?: string
  harInntektVsaHelPensjon?: string
  sivilstand?: string
  epsHarInntektOver2G?: string
  epsHarPensjon?: string
  simuleringType?: string
}

export interface ContextForm {
  state: State
  setState: Dispatch<React.SetStateAction<FormValues>>
  formPageProps: NavigationProps
}

export interface StepRef {
  onSubmit: () => void
}

export interface NavigationProps {
  curStep: number
  length: number
  goBack: () => void
  onStepChange?: (step: number) => void
  handleSubmit?: () => void
  goToNext: () => void
}
