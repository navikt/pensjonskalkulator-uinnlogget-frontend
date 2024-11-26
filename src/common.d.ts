import type { components } from './types/schema.d.ts'
import { errors } from './texts/errors'
export type APIPayload = components['schemas']['AnonymSimuleringSpecV1']
export type ApiPayloadStripped = Omit<ApiPayload, 'foedselAar'>
export interface State extends Omit<APIPayload, 'foedselAar'> {
  foedselAar:
    | null
    | components['schemas']['AnonymSimuleringSpecV1']['foedselAar']
  gradertUttak?: OptionalGradertUttak
  heltUttak: OptionalHeltUttak
  harBoddIUtland: boolean | null
  harInntektVsaHelPensjon: boolean | null
}
export type OptionalGradertUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['gradertUttak'],
  'grad' | 'uttakAlder' | 'aarligInntektVsaPensjonBeloep'
> & {
  grad: null | components['schemas']['AnonymSimuleringGradertUttakV1']['grad']
  uttakAlder: {
    aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
  }
  aarligInntektVsaPensjonBeloep?: components['schemas']['AnonymSimuleringGradertUttakV1']['aarligInntektVsaPensjonBeloep']
}
export type OptionalHeltUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['heltUttak'],
  'uttakAlder' | 'aarligInntektVsaPensjon'
> & {
  uttakAlder: {
    aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
  }
  aarligInntektVsaPensjon?: {
    beloep: null | components['schemas']['AnonymSimuleringInntektV1']['beloep']
    sluttAlder?: {
      aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
      maaneder:
        | null
        | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
    }
  }
}
export type Simuleringsresultat =
  components['schemas']['AnonymSimuleringResultV1']

export type SimuleringError = components['schemas']['AnonymSimuleringErrorV1']

export type ErrorStatus = keyof typeof errors

export type StepName =
  | 'AlderStep'
  | 'UtlandsStep'
  | 'InntektStep'
  | 'EktefelleStep'
  | 'AFPStep'
export type ErrorFields = {
  foedselAar?: string
  inntektOver1GAntallAar?: string
  harBoddIUtland?: string
  utenlandsAntallAar?: string
  aarligInntektFoerUttakBeloep?: string
  uttaksgrad?: string
  gradertInntekt?: string
  gradertAar?: string
  gradertMaaneder?: string
  heltUttakAar?: string
  heltUttakMaaneder?: string
  helPensjonInntekt?: string
  heltUttakSluttAlderAar?: string
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
  onStepChange: (step: number) => void
  handleSubmit?: () => void
  goToNext: () => void
}
