import { ErrorMessages } from '@/common'

export const errors = {
  PKU222BeregningstjenesteFeiletException:
    'Det har oppstått en feil. Vennligst prøv igjen senere.',
  PKU225AvslagVilkarsprovingForLavtTidligUttakException:
    'Opptjeningen din er ikke høy nok til ønsket uttak. Du må øke alderen eller sette ned uttaksgraden.',
  PKU224AvslagVilkarsprovingForKortTrygdetidException:
    'Opptjeningen din er ikke høy nok til ønsket uttak. Du må øke alderen eller sette ned uttaksgraden.',
  default: 'Det har oppstått en feil. Vennligst prøv igjen senere.',
} as ErrorMessages

export const getErrors: () => ErrorMessages = () => errors
