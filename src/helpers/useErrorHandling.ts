import { useState, useMemo } from 'react'
import { StepName, ErrorFields, State } from '@/common'

const useErrorHandling = (states: State) => {
  const validateInntektOver1GAntallAar = (): string => {
    if (states.inntektOver1GAntallAar === undefined || states.inntektOver1GAntallAar === 0) {
      return 'Fyll ut antall år';
    }
    if (states.inntektOver1GAntallAar < 0) {
      return 'Antall år kan ikke være negativt';
    }
    if (states.inntektOver1GAntallAar > 50) {
      return 'Du kan ikke være yrkesaktiv i mer enn 50 år';
    }
    return '';
  }

  const validateUtenlandsAntallAar = (): string => {
    if (states.utenlandsAntallAar !== undefined) {
      if (states.utenlandsAntallAar === 0 && states.boddIUtland === 'ja') {
        return 'Du må fylle ut antall år';
      }
      if (states.utenlandsAntallAar < 0) {
        return 'Antall år må være positiv';
      }
    }
    return '';
  }

  const validateAarligInntektFoerUttakBeloep = (): string => {
    if (states.aarligInntektFoerUttakBeloep === undefined) {
      return 'Du må fylle ut inntekt';
    }
    if (states.aarligInntektFoerUttakBeloep === 0) {
      return 'Inntekt kan ikke være 0';
    }
    if (states.aarligInntektFoerUttakBeloep < 0) {
      return 'Inntekt kan ikke være negativ';
    }
    return '';
  }

  const validateGradertInntekt = (): string => {
    const gradertUttak = states.gradertUttak;
    if (gradertUttak !== undefined && gradertUttak.grad > 0 && gradertUttak.grad !== 100) {
      if (!gradertUttak.aarligInntektVsaPensjonBeloep) {
        return 'Du må fylle ut inntekt';
      }
      if (gradertUttak.aarligInntektVsaPensjonBeloep < 0) {
        return 'Inntekt kan ikke være negativ';
      }
    }
    return '';
  }

  const validateGradertUttak = (): { aar: string, maaneder: string } => {
    const gradertUttak = states.gradertUttak;
    let aarError = '';
    let maanederError = '';
  
    if (gradertUttak !== undefined && gradertUttak.grad > 0 && gradertUttak.grad !== 100) {
      if (gradertUttak.uttakAlder.aar === 0) {
        aarError = 'Du må velge alder';
      }
      if (gradertUttak.uttakAlder.maaneder === -1) {
        maanederError = 'Du må velge måned';
      }
    }
  
    return { aar: aarError, maaneder: maanederError };
  }

  const validateHelPensjonInntekt = (): string => {
    const heltUttak = states.heltUttak;
    if (states.inntektVsaHelPensjon === 'ja') {
      if (!heltUttak.aarligInntektVsaPensjon?.beloep) {
        return 'Du må fylle ut inntekt';
      }
      if (heltUttak.aarligInntektVsaPensjon.beloep < 0) {
        return 'Inntekt kan ikke være negativ';
      }
    }
    return '';
  }

  const validateHeltUttakSluttAlderMaaneder = (): string => {
    const heltUttak = states.heltUttak;
    if (
      heltUttak.aarligInntektVsaPensjon?.sluttAlder &&
      heltUttak.aarligInntektVsaPensjon.sluttAlder.aar !== 0 &&
      heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder === -1
    ) {
      return 'Du må velge måned';
    }
    return '';
  }

  const validateFields = (step: StepName) => {
    const errors: ErrorFields = {};

    if (step === 'AlderStep') {
      errors.foedselAar = states.foedselAar < 1900 || states.foedselAar > new Date().getFullYear()? 'Du må oppgi et gyldig årstall' : ''
      errors.inntektOver1GAntallAar = validateInntektOver1GAntallAar()
    }

    if (step === 'UtlandsStep') {
      errors.boddIUtland = !states.boddIUtland? 'Du må velge et alternativ': ''
      errors.utenlandsAntallAar = validateUtenlandsAntallAar()
    }

    if (step === 'InntektStep') {
      errors.aarligInntektFoerUttakBeloep = validateAarligInntektFoerUttakBeloep()
      errors.uttaksgrad = states.gradertUttak?.grad === 0 ? 'Du må velge uttaksgrad' : ''
      errors.gradertInntekt = validateGradertInntekt()
      errors.gradertAar = validateGradertUttak().aar
      errors.gradertMaaneder = validateGradertUttak().maaneder
      errors.heltUttakAar = states.heltUttak.uttakAlder.aar === 0 ? 'Du må velge alder' : ''
      errors.heltUttakMaaneder = states.heltUttak.uttakAlder.maaneder === -1 ? 'Du må velge måned' : ''
      errors.helPensjonInntekt = validateHelPensjonInntekt()
      errors.heltUttakSluttAlderMaaneder = validateHeltUttakSluttAlderMaaneder()
      errors.inntektVsaHelPensjon = states.inntektVsaHelPensjon === '' ? 'Velg alternativ' : ''
    }

    if (step === 'EktefelleStep') {
      errors.sivilstand = !states.sivilstand ? 'Du må velge et alternativ' : ''
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
      clearError: (field: string | null) => {
        if (field !== null) {
          setErrorFields((prev) => ({ ...prev, [field]: '' }))
        }
      },
      /* clearError: (field: string) => { 
        setErrorFields((prev) => ({ ...prev, [field]: '' }))
      }, */
    }),
    [states]
  )

  return [errorFields, handlers] as const
}

export default useErrorHandling