import {
  AmplitudeEvent,
  getAnalyticsInstance,
} from '@navikt/nav-dekoratoren-moduler'

type IExtendedAmpltitudeEvents =
  | AmplitudeEvent<'resultat vist', { tekst: string }>
  | AmplitudeEvent<'button klikk', { tekst: string }>
  | AmplitudeEvent<'feilside', { feil: string }>
  | AmplitudeEvent<'alert', { feil: string }>

// * Create a safer logger that handles development environment
const createLogger = () => {
  try {
    // * Use getAnalyticsInstance which handles both Umami and Amplitude
    // * with built-in error handling and fallbacks
    return getAnalyticsInstance<IExtendedAmpltitudeEvents>('dekoratoren')
  } catch (error) {
    // * In development, return a no-op logger if analytics fails
    console.warn('Analytics logger failed to initialize:', error)
    return (eventName: string, properties?: Record<string, unknown>) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Analytics event: ${eventName}`, properties)
      }
    }
  }
}

export const logger = createLogger()
