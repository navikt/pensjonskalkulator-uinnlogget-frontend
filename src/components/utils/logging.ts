import {
  AmplitudeEvent,
  getAmplitudeInstance,
} from '@navikt/nav-dekoratoren-moduler'

type IExtendedAmpltitudeEvents =
  | AmplitudeEvent<'resultat vist', { tekst: string }>
  | AmplitudeEvent<'button klikk', { tekst: string }>
  | AmplitudeEvent<'feilside', { feil: string }>
  | AmplitudeEvent<'alert', { feil: string }>

export const logger =
  getAmplitudeInstance<IExtendedAmpltitudeEvents>('dekoratoren')
