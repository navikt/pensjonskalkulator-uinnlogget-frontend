import type { components } from './types/schema.d.ts'
export type APIPayload = components['schemas']['AnonymSimuleringSpecV1']
export type ApiPayloadStripped = Omit<ApiPayload, 'foedselAar'>

export interface State
  extends Omit<
    APIPayload,
    | 'foedselAar'
    | 'inntektOver1GAntallAar'
    | 'utenlandsAntallAar'
    | 'aarligInntektFoerUttakBeloep'
  > {
  foedselAar: string | null
  inntektOver1GAntallAar: string | null
  aarligInntektFoerUttakBeloep: string | null
  utenlandsAntallAar?: string
  gradertUttak?: OptionalGradertUttak
  heltUttak: OptionalHeltUttak
  harBoddIUtland: boolean | null
  harInntektVsaHelPensjon: boolean | null
}

export type OptionalGradertUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['gradertUttak'],
  'grad' | 'uttaksalder' | 'aarligInntektVsaPensjonBeloep'
> & {
  grad: null | components['schemas']['AnonymSimuleringGradertUttakV1']['grad']
  uttaksalder: {
    aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
  }
  aarligInntektVsaPensjonBeloep?: string
}
export type OptionalHeltUttak = Omit<
  components['schemas']['AnonymSimuleringSpecV1']['heltUttak'],
  'uttaksalder' | 'aarligInntektVsaPensjon'
> & {
  uttaksalder: {
    aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
    maaneder:
      | null
      | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
  }
  aarligInntektVsaPensjon?: {
    beloep: string | null
    sluttAlder?: {
      aar: null | components['schemas']['AnonymSimuleringAlderV1']['aar']
      maaneder:
        | null
        | components['schemas']['AnonymSimuleringAlderV1']['maaneder']
    }
  }
}

export type Alder = components['schemas']['AnonymAlderV1']

export type Simuleringsresultat =
  components['schemas']['AnonymSimuleringResultV1']

export type SimuleringError = components['schemas']['AnonymSimuleringErrorV1']

export type ErrorStatus =
  | 'PKU222BeregningstjenesteFeiletException'
  | 'PKU225AvslagVilkarsprovingForLavtTidligUttakException'
  | 'PKU224AvslagVilkarsprovingForKortTrygdetidException'
  | 'default'

export type ErrorMessages = {
  [key in ErrorStatus]: string
}

export type StepName =
  | 'AlderStep'
  | 'UtlandsStep'
  | 'InntektStep'
  | 'SivilstandStep'
  | 'AFPStep'
export type ErrorFields = {
  foedselAar?: string
  inntektOver1GAntallAar?: string
  harBoddIUtland?: string
  utenlandsAntallAar?: string
  aarligInntektFoerUttakBeloep?: string
  uttaksgrad?: string
  gradertUttaksalder?: string
  gradertInntekt?: string
  heltUttaksalder?: string
  helPensjonInntekt?: string
  heltUttakSluttAlderAar?: string
  harInntektVsaHelPensjon?: string
  sivilstand?: string
  epsHarInntektOver2G?: string
  epsHarPensjon?: string
  simuleringstype?: string
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
  goTo: (step: number) => void
  handleSubmit?: () => void
  goToNext: () => void
}

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

export type Sivilstand = PropType<State, 'sivilstand'>

export type Simuleringstype = PropType<State, 'simuleringstype'>
