import { ErrorMessages } from '@/common'

export const errors = {
  RegelmotorFeilException:
    'Det har oppstått en feil. Vennligst prøv igjen senere.',
  UtilstrekkeligOpptjeningException:
    'Opptjeningen din er ikke høy nok til ønsket uttak. Du må øke alderen eller sette ned uttaksgraden.',
  UtilstrekkeligTrygdetidException: 'Du har for kort trygdetid.',
  default: 'Det har oppstått en feil. Vennligst prøv igjen senere.',
} as ErrorMessages

export const validationErrors = {
  foedselAarMissing: 'Du må oppgi årstall',
  foedselAarInvalid: 'Du må oppgi årstall med siffer (ÅÅÅÅ, f.eks. 1960)',
  foedselAarRange: (minYear: number, currentYear: number) =>
    `Årstall må være mellom ${minYear} og ${currentYear}`,
}

export const getErrors: () => ErrorMessages = () => errors
