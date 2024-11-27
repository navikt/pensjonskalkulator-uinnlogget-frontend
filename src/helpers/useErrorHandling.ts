import { useState, useMemo } from 'react'
import { StepName, ErrorFields, State } from '@/common'

const useErrorHandling = (state: State) => {
  const validateInntektOver1GAntallAar = (): string => {
    if (!state.inntektOver1GAntallAar) {
      return 'Du må fylle ut antall år';
    }
    else if (state.inntektOver1GAntallAar < 0) {
      return 'Antall år kan ikke være negativt';
    }
    else if (state.inntektOver1GAntallAar > 50) {
      return 'Du kan ikke være yrkesaktiv i mer enn 50 år';
    }
    return '';
  }

  const validateUtenlandsAntallAar = (): string => {
      if ((!state.utenlandsAntallAar || state.utenlandsAntallAar === 0) && state.harBoddIUtland === true) {
        return 'Du må fylle ut antall år';
      }
      if (state.utenlandsAntallAar && state.utenlandsAntallAar < 0) {
        return 'Antall år må være positiv';
      }
    return '';
  }

  const validateAarligInntektFoerUttakBeloep = (): string => {
    if (state.aarligInntektFoerUttakBeloep === undefined) {
      return 'Du må fylle ut inntekt';
    }
    if (state.aarligInntektFoerUttakBeloep < 0) {
      return 'Inntekt kan ikke være negativ';
    }
    return '';
  }

  const validateGradertUttak = (): { aar: string, maaneder: string } => {
    let aarError = '';
    let maanederError = '';
  
    if (state.gradertUttak?.grad) {
      if (state.gradertUttak.uttakAlder?.aar === null) {
        aarError = 'Du må velge alder';
      }
      if (state.gradertUttak.uttakAlder?.maaneder === null) {
        maanederError = 'Du må velge måned';
      }
    }
  
    return { aar: aarError, maaneder: maanederError };
  }

  const validateGradertInntekt = (): string => {
    if (state.gradertUttak?.grad) {
      if(!state.gradertUttak.aarligInntektVsaPensjonBeloep) {
        return 'Du må fylle ut inntekt';
      }
      if (state.gradertUttak.aarligInntektVsaPensjonBeloep && state.gradertUttak.aarligInntektVsaPensjonBeloep < 0) {
        return 'Inntekt kan ikke være negativ';
      }
    }
    return '';
  }

  const validateHelPensjonInntekt = (): string => {
    const heltUttak = state.heltUttak;
    if (state.harInntektVsaHelPensjon === true) {
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

    if(state.harInntektVsaHelPensjon && state.heltUttak.aarligInntektVsaPensjon?.sluttAlder) {
      if(state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar === null) {
        aarError = 'Du må velge alder';
      }
      if(state.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder === null) {
        maanederError = 'Du må velge måned';
      }
    }

    return { aar: aarError, maaneder: maanederError };
  }

  const validateFields = (step: StepName) => {
    const errors: ErrorFields = {};

    if (step === 'AlderStep') {
      errors.foedselAar = !state.foedselAar || state.foedselAar < 1900 || state.foedselAar > new Date().getFullYear()? 'Du må oppgi et gyldig årstall' : ''
      errors.inntektOver1GAntallAar = validateInntektOver1GAntallAar()
    }

    if (step === 'UtlandsStep') {
      errors.harBoddIUtland = state.harBoddIUtland === null ? 'Du må velge et alternativ': ''
      errors.utenlandsAntallAar = validateUtenlandsAntallAar()
    }

    if (step === 'InntektStep') {
      errors.aarligInntektFoerUttakBeloep = validateAarligInntektFoerUttakBeloep()
      errors.uttaksgrad = state.gradertUttak && state.gradertUttak.grad === null ? 'Du må velge uttaksgrad' : ''
      errors.gradertAar = validateGradertUttak().aar
      errors.gradertMaaneder = validateGradertUttak().maaneder
      errors.gradertInntekt = validateGradertInntekt()
      errors.heltUttakAar = state.heltUttak.uttakAlder?.aar === null ? 'Du må velge alder' : ''
      errors.heltUttakMaaneder = state.heltUttak.uttakAlder?.maaneder === null ? 'Du må velge måned' : ''
      errors.helPensjonInntekt = validateHelPensjonInntekt()
      errors.heltUttakSluttAlderAar = validateHeltUttakSluttAlder().aar
      errors.heltUttakSluttAlderMaaneder = validateHeltUttakSluttAlder().maaneder
      errors.harInntektVsaHelPensjon = state.harInntektVsaHelPensjon === null ? 'Velg alternativ' : ''
    }

    if (step === 'EktefelleStep') {
      errors.sivilstand = !state.sivilstand || state.sivilstand === '' ? 'Du må velge et alternativ' : ''
      errors.epsHarInntektOver2G = state.sivilstand !== 'UGIFT' && state.epsHarInntektOver2G === undefined ? 'Du må velge et alternativ' : ''
      errors.epsHarPensjon = state.sivilstand !== 'UGIFT' && state.epsHarPensjon === undefined ? 'Du må velge et alternativ' : ''
    }

    if (step === 'AFPStep') {
      errors.simuleringType = state.simuleringType === undefined || state.simuleringType === '' ? 'Du må velge et alternativ' : ''
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
    [state]
  )

  return [errorFields, handlers] as const
}

export default useErrorHandling