import { useState, useMemo, useEffect } from 'react'
import { StepName, ErrorFields, State } from '@/common'
import { formatInntektToNumber } from '@/components/pages/utils/inntekt';

const useErrorHandling = (state: State) => {
  const validateInntektOver1GAntallAar = (): string => {
    
    if (!state.inntektOver1GAntallAar) {
      return 'Du må oppgi antall år som du har jobbet i Norge';
    }
    if (isNaN(+state.inntektOver1GAntallAar)) {
      return 'Du må oppgi antall år med siffer';
    }
    if (+state.inntektOver1GAntallAar < 0) {
      return 'Antall år kan ikke være negativt';
    }
    if (+state.inntektOver1GAntallAar > 50) {
      return 'Du kan ikke være yrkesaktiv i mer enn 50 år';
    }
    return '';
  }

  const validateUtenlandsAntallAar = (): string => {
  
      if ((!state.utenlandsAntallAar || +state.utenlandsAntallAar === 0) && state.harBoddIUtland === true) {
        return 'Du må fylle ut antall år';
      }
      if (state.utenlandsAntallAar && isNaN(+state.utenlandsAntallAar)) {
        return 'Du må oppgi antall år med siffer';
      }
      if (state.utenlandsAntallAar && +state.utenlandsAntallAar < 0) {
        return 'Antall år må være positiv';
      }
    return '';
  }

  const validateAarligInntektFoerUttakBeloep = (): string => {
    const aarligInntekt = state.aarligInntektFoerUttakBeloep;
    const parsedInntekt = formatInntektToNumber(aarligInntekt);
    if (aarligInntekt === null) {
      return 'Du må fylle ut inntekt';
    }
    if (isNaN(parsedInntekt)) {
      return 'Du må skrive hele tall med siffer for å oppgi inntekt';
    }
    if (parsedInntekt < 0) {
      return 'Inntekt kan ikke være negativ';
    }
    if(parsedInntekt > 100000000){
      return 'Inntekten kan ikke overskride 100 000 000 kroner';
    }
    return '';
  }

  const validateGradertUttak = (): string => {
    if (state.gradertUttak?.grad) {
      if (state.gradertUttak.uttaksalder?.aar === null) {
        return 'Du må velge alder';
      }
      if(state.gradertUttak.uttaksalder?.aar && state.gradertUttak.uttaksalder?.aar < new Date().getFullYear() - +state.foedselAar!) {
        return 'Din uttaksalder kan ikke være lavere enn ditt fødselsår';
      }
    }
  
    return '';
  }

  const validateGradertInntekt = (): string => {
    if (state.gradertUttak?.grad) {
      const parsedInntekt = formatInntektToNumber(state.gradertUttak.aarligInntektVsaPensjonBeloep);
      if(!state.gradertUttak.aarligInntektVsaPensjonBeloep) {
        return 'Du må fylle ut inntekt';
      }
      if(isNaN(parsedInntekt)) {
        return 'Du må skrive hele tall med siffer for å oppgi inntekt';
      }
      if (state.gradertUttak.aarligInntektVsaPensjonBeloep && parsedInntekt < 0) {
        return 'Inntekt kan ikke være negativ';
      }
      if(parsedInntekt > 100000000){
        return 'Inntekten kan ikke overskride 100 000 000 kroner';
      }
    }
    return '';
  }

  const validateHelUttaksalder = (): string => {
    if(state.heltUttak.uttaksalder?.aar === null) {
      return 'Du må velge alder';
    }
    if(state.gradertUttak?.uttaksalder.aar && state.heltUttak.uttaksalder.aar){
      if(state.heltUttak.uttaksalder.aar <= state.gradertUttak.uttaksalder.aar){
        return 'Du må oppgi en senere alder for 100 % uttak enn den du har oppgitt for gradert uttak';
      }
    }
    if(state.heltUttak.uttaksalder?.aar && state.heltUttak.uttaksalder?.aar < new Date().getFullYear() - +state.foedselAar!) {
      return 'Din uttaksalder kan ikke være lavere enn ditt fødselsår';
    }
    return '';
  }

  const validateHelPensjonInntekt = (): string => {
    const heltUttak = state.heltUttak;
    const parsedInntekt = formatInntektToNumber(heltUttak.aarligInntektVsaPensjon?.beloep);
    if (state.harInntektVsaHelPensjon === true) {
      if (!heltUttak.aarligInntektVsaPensjon?.beloep || heltUttak.aarligInntektVsaPensjon?.beloep === '0') {
        return 'Du må fylle ut inntekt';
      }
      if (isNaN(parsedInntekt)) {
        return 'Du må skrive hele tall med siffer for å oppgi inntekt';
      }
      if (parsedInntekt < 0) {
        return 'Inntekt kan ikke være negativ';
      }
      if(parsedInntekt > 100000000){
        return 'Inntekten kan ikke overskride 100 000 000 kroner';
      }
    }
    return '';
  }

  const validateHeltUttakSluttAlder = (): string => {
    if(state.harInntektVsaHelPensjon && state.heltUttak.aarligInntektVsaPensjon?.sluttAlder) {
      if(state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar === null) {
        return 'Du må velge alder';
      }
      if(state.heltUttak.uttaksalder.aar){
        if(state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar <= state.heltUttak.uttaksalder.aar){
          return 'Du må oppgi en senere alder for inntekt enn den du har oppgitt for helt uttak';
        }
      }
      if(state.gradertUttak?.uttaksalder.aar){
        if(state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar <= state.gradertUttak.uttaksalder.aar){
          return 'Du må oppgi en senere alder for inntekt enn den du har oppgitt for gradert uttak';
        }
      }
    }

    return '';
  }

  const validateFields = (step: StepName) => {
    const errors: ErrorFields = {};

    if (step === 'AlderStep') {
      if (!state.foedselAar) {
        errors.foedselAar = "Du må oppgi årstall";
      } else if (isNaN(+state.foedselAar)) {
        errors.foedselAar = "Du må oppgi årstall med siffer (ÅÅÅÅ, f.eks. 1960)";
      } else if (+state.foedselAar < (new Date().getFullYear() - 75) || +state.foedselAar > new Date().getFullYear()) {
        errors.foedselAar = 'Du må oppgi et gyldig årstall';
      } else {
        errors.foedselAar = '';
      }
      errors.inntektOver1GAntallAar = validateInntektOver1GAntallAar()
    }

    if (step === 'UtlandsStep') {
      errors.harBoddIUtland = state.harBoddIUtland === null ? 'Du må velge et alternativ': ''
      errors.utenlandsAntallAar = validateUtenlandsAntallAar()
    }

    if (step === 'InntektStep') {
      errors.aarligInntektFoerUttakBeloep = validateAarligInntektFoerUttakBeloep()
      errors.uttaksgrad = state.gradertUttak && state.gradertUttak.grad === null ? 'Du må velge uttaksgrad' : ''
      errors.gradertUttaksalder = validateGradertUttak()
      errors.gradertInntekt = validateGradertInntekt()
      errors.heltUttaksalder = validateHelUttaksalder() 
      errors.helPensjonInntekt = validateHelPensjonInntekt()
      errors.heltUttakSluttAlder = validateHeltUttakSluttAlder()
      errors.harInntektVsaHelPensjon = state.harInntektVsaHelPensjon === null ? 'Du må velge et alternativ' : ''
    }

    if (step === 'SivilstandStep') {
      errors.sivilstand = !state.sivilstand ? 'Du må velge et alternativ' : ''
      errors.epsHarInntektOver2G = state.sivilstand !== 'UGIFT' && state.epsHarInntektOver2G === undefined ? 'Du må velge et alternativ' : ''
      errors.epsHarPensjon = state.sivilstand !== 'UGIFT' && state.epsHarPensjon === undefined ? 'Du må velge et alternativ' : ''
    }

    if (step === 'AFPStep') {
      errors.simuleringstype = !state.simuleringstype ? 'Du må velge et alternativ' : ''
    }

    setErrorFields(errors)

    return Object.values(errors).some((error) => error !== '')
  }

  const validateAllFields = () => {
    return [
    validateFields('AlderStep') ? 'alder' : null,
    validateFields('UtlandsStep') ? 'utland' : null,
    validateFields('InntektStep') ? 'inntekt' : null,
    validateFields('SivilstandStep') ? 'sivilstand' : null,
    ].filter((error) => error !== null)
  }

  const [errorFields, setErrorFields] = useState<ErrorFields>({});

  const handlers = useMemo(
    () => ({
      validateAllFields,
      validateFields,
      clearError: (field: string) => { 
        setErrorFields((prev) => ({ ...prev, [field]: '' }))
      },
    }),
    [state]
  )

  useEffect(() => {
    const ariaInvalidElements = document.querySelectorAll(
      'input[aria-invalid]:not([aria-invalid="false"]), select[aria-invalid]:not([aria-invalid="false"]), [data-has-error="true"]'
    )

    if (
      document.activeElement?.tagName === 'BUTTON' &&
      ariaInvalidElements.length > 0
    ) {
      ;(ariaInvalidElements[0] as HTMLElement).focus()
      ;(ariaInvalidElements[0] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [errorFields])

  return [errorFields, handlers] as const
}

export default useErrorHandling