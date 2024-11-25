import { useState, useMemo } from 'react'
import { StepName, ErrorFields, State } from '@/common'

const useErrorHandling = (states: State) => {
  const validateInntektOver1GAntallAar = (): string => {
    if (!states.inntektOver1GAntallAar) {
      return 'Fyll ut antall år';
    }
    else if (states.inntektOver1GAntallAar < 0) {
      return 'Antall år kan ikke være negativt';
    }
    else if (states.inntektOver1GAntallAar > 50) {
      return 'Du kan ikke være yrkesaktiv i mer enn 50 år';
    }
    return '';
  }

  const validateUtenlandsAntallAar = (): string => {
      if ((!states.utenlandsAntallAar || states.utenlandsAntallAar === 0) && states.harBoddIUtland === true) {
        return 'Du må fylle ut antall år';
      }
      if (states.utenlandsAntallAar && states.utenlandsAntallAar < 0) {
        return 'Antall år må være positiv';
      }
    return '';
  }

  const validateAarligInntektFoerUttakBeloep = (): string => {
    if (states.aarligInntektFoerUttakBeloep === undefined) {
      return 'Du må fylle ut inntekt';
    }
    if (states.aarligInntektFoerUttakBeloep < 0) {
      return 'Inntekt kan ikke være negativ';
    }
    return '';
  }

  const validateGradertUttak = (): { aar: string, maaneder: string } => {
    let aarError = '';
    let maanederError = '';

    console.log(states.gradertUttak)
  
    if (states.gradertUttak?.grad) {
      if (states.gradertUttak.uttakAlder?.aar === null) {
        aarError = 'Du må velge alder';
      }
      if (states.gradertUttak.uttakAlder?.maaneder === null) {
        maanederError = 'Du må velge måned';
      }
    }
  
    return { aar: aarError, maaneder: maanederError };
  }

  const validateGradertInntekt = (): string => {
    if (states.gradertUttak?.grad) {
      if (states.gradertUttak.aarligInntektVsaPensjonBeloep && states.gradertUttak.aarligInntektVsaPensjonBeloep < 0) {
        return 'Inntekt kan ikke være negativ';
      }
    }
    return '';
  }

  const validateHelPensjonInntekt = (): string => {
    const heltUttak = states.heltUttak;
    if (states.harInntektVsaHelPensjon === true) {
      if (!heltUttak.aarligInntektVsaPensjon?.beloep) {
        return 'Du må fylle ut inntekt';
      }
      if (heltUttak.aarligInntektVsaPensjon.beloep < 0) {
        return 'Inntekt kan ikke være negativ';
      }
    }
    return '';
  }

  const validateHeltUttakSluttAlder = (): {aar: string, maaneder: string} => {
    let aarError = '';
    let maanederError = '';

    if(states.heltUttak.aarligInntektVsaPensjon?.sluttAlder) {
      if(states.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar === null) {
        aarError = 'Du må velge alder';
      }
      if(states.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder === null) {
        maanederError = 'Du må velge måned';
      }
    }

    return { aar: aarError, maaneder: maanederError };
  }

  /* const validateHeltUttakSluttAlder = (): string => {
    const heltUttak = states.heltUttak;
    if (
      heltUttak.aarligInntektVsaPensjon?.sluttAlder &&
      heltUttak.aarligInntektVsaPensjon.sluttAlder.aar !== null &&
      heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder === null
    ) {
      return 'Du må velge måned';
    }
    return '';
  } */

  const validateFields = (step: StepName) => {
    const errors: ErrorFields = {};

    if (step === 'AlderStep') {
      errors.foedselAar = !states.foedselAar || states.foedselAar < 1900 || states.foedselAar > new Date().getFullYear()? 'Du må oppgi et gyldig årstall' : ''
      errors.inntektOver1GAntallAar = validateInntektOver1GAntallAar()
    }

    if (step === 'UtlandsStep') {
      errors.harBoddIUtland = states.harBoddIUtland === null ? 'Du må velge et alternativ': ''
      errors.utenlandsAntallAar = validateUtenlandsAntallAar()
    }

    if (step === 'InntektStep') {
      errors.aarligInntektFoerUttakBeloep = validateAarligInntektFoerUttakBeloep()
      errors.uttaksgrad = states.gradertUttak && states.gradertUttak.grad === null ? 'Du må velge uttaksgrad' : ''
      errors.gradertAar = validateGradertUttak().aar
      errors.gradertMaaneder = validateGradertUttak().maaneder
      errors.gradertInntekt = validateGradertInntekt()
      errors.heltUttakAar = states.heltUttak.uttakAlder?.aar === null ? 'Du må velge alder' : ''
      errors.heltUttakMaaneder = states.heltUttak.uttakAlder?.maaneder === null ? 'Du må velge måned' : ''
      errors.helPensjonInntekt = validateHelPensjonInntekt()
      //errors.heltUttakSluttAlder = validateHeltUttakSluttAlder()
      errors.heltUttakSluttAlderAar = validateHeltUttakSluttAlder().aar
      errors.heltUttakSluttAlderMaaneder = validateHeltUttakSluttAlder().maaneder
      errors.harInntektVsaHelPensjon = states.harInntektVsaHelPensjon === null ? 'Velg alternativ' : ''
    }

    if (step === 'EktefelleStep') {
      errors.sivilstand = !states.sivilstand || states.sivilstand === '' ? 'Du må velge et alternativ' : ''
      errors.epsHarInntektOver2G = states.sivilstand !== 'UGIFT' && states.epsHarInntektOver2G === undefined ? 'Du må velge et alternativ' : ''
      errors.epsHarPensjon = states.sivilstand !== 'UGIFT' && states.epsHarPensjon === undefined ? 'Du må velge et alternativ' : ''
    }

    if (step === 'AFPStep') {
      errors.simuleringType = states.simuleringType === undefined || states.simuleringType === '' ? 'Du må velge et alternativ' : ''
    }

    setErrorFields(errors)

    return Object.values(errors).some((error) => error !== '')
  }

  const [errorFields, setErrorFields] = useState<ErrorFields>({});

  const handlers = useMemo(
    () => ({
      validateFields,
      clearError: (field: string) => { 
        setErrorFields((prev) => ({ ...prev, [field]: '' }))
      },
    }),
    [states]
  )

  return [errorFields, handlers] as const
}

export default useErrorHandling