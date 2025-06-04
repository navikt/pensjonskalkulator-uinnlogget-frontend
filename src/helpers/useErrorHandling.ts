import { useCallback, useEffect, useMemo, useState } from 'react'

import { ErrorFields, State, StepName } from '@/common'
import { formatInntektToNumber } from '@/components/pages/utils/inntekt'

const useErrorHandling = ({
  inntektOver1GAntallAar,
  utenlandsAntallAar,
  harBoddIUtland,
  aarligInntektFoerUttakBeloep,
  gradertUttak,
  foedselAar,
  heltUttak,
  harInntektVsaHelPensjon,
  sivilstand,
  simuleringstype,
  epsHarInntektOver2G,
  epsHarPensjon,
}: State) => {
  const validateInntektOver1GAntallAar = useCallback((): string => {
    if (!inntektOver1GAntallAar) {
      return 'Du må oppgi antall år som du har jobbet i Norge'
    }
    if (isNaN(+inntektOver1GAntallAar)) {
      return 'Du må oppgi antall år med siffer'
    }
    if (+inntektOver1GAntallAar < 0) {
      return 'Antall år kan ikke være negativt'
    }
    if (+inntektOver1GAntallAar > 50) {
      return 'Du kan ikke være yrkesaktiv i mer enn 50 år'
    }
    return ''
  }, [inntektOver1GAntallAar])

  const validateUtenlandsAntallAar = useCallback((): string => {
    if (
      (!utenlandsAntallAar || +utenlandsAntallAar === 0) &&
      harBoddIUtland === true
    ) {
      return 'Du må fylle ut antall år'
    }
    if (utenlandsAntallAar && isNaN(+utenlandsAntallAar)) {
      return 'Du må oppgi antall år med siffer'
    }
    if (utenlandsAntallAar && +utenlandsAntallAar < 0) {
      return 'Antall år må være positiv'
    }
    return ''
  }, [utenlandsAntallAar, harBoddIUtland])

  const validateAarligInntektFoerUttakBeloep = useCallback((): string => {
    const parsedInntekt = formatInntektToNumber(aarligInntektFoerUttakBeloep)
    if (aarligInntektFoerUttakBeloep === null) {
      return 'Du må fylle ut inntekt'
    }
    if (isNaN(parsedInntekt)) {
      return 'Du må skrive hele tall med siffer for å oppgi inntekt'
    }
    if (parsedInntekt < 0) {
      return 'Inntekt kan ikke være negativ'
    }
    if (parsedInntekt > 100000000) {
      return 'Inntekten kan ikke overskride 100 000 000 kroner'
    }
    return ''
  }, [aarligInntektFoerUttakBeloep])

  const validateGradertUttak = useCallback((): string => {
    if (gradertUttak?.grad) {
      if (gradertUttak.uttaksalder?.aar === null) {
        return 'Du må velge alder'
      }
      if (
        gradertUttak.uttaksalder?.aar &&
        gradertUttak.uttaksalder?.aar < new Date().getFullYear() - +foedselAar!
      ) {
        return 'Din uttaksalder kan ikke være lavere enn ditt fødselsår'
      }
    }
    return ''
  }, [gradertUttak, foedselAar])

  const validateGradertInntekt = useCallback((): string => {
    if (gradertUttak?.grad) {
      const parsedInntekt = formatInntektToNumber(
        gradertUttak.aarligInntektVsaPensjonBeloep
      )
      if (!gradertUttak.aarligInntektVsaPensjonBeloep) {
        return 'Du må fylle ut inntekt'
      }
      if (isNaN(parsedInntekt)) {
        return 'Du må skrive hele tall med siffer for å oppgi inntekt'
      }
      if (gradertUttak.aarligInntektVsaPensjonBeloep && parsedInntekt < 0) {
        return 'Inntekt kan ikke være negativ'
      }
      if (parsedInntekt > 100000000) {
        return 'Inntekten kan ikke overskride 100 000 000 kroner'
      }
    }
    return ''
  }, [gradertUttak])

  const validateHelUttaksalder = useCallback((): string => {
    if (heltUttak.uttaksalder?.aar === null) {
      return 'Du må velge alder'
    }
    if (gradertUttak?.uttaksalder.aar && heltUttak.uttaksalder.aar) {
      if (heltUttak.uttaksalder.aar <= gradertUttak.uttaksalder.aar) {
        return 'Du må oppgi en senere alder for 100 % uttak enn den du har oppgitt for gradert uttak'
      }
    }
    if (
      heltUttak.uttaksalder?.aar &&
      heltUttak.uttaksalder?.aar < new Date().getFullYear() - +foedselAar!
    ) {
      return 'Din uttaksalder kan ikke være lavere enn ditt fødselsår'
    }
    return ''
  }, [heltUttak.uttaksalder, gradertUttak?.uttaksalder, foedselAar])

  const validateHelPensjonInntekt = useCallback((): string => {
    const parsedInntekt = formatInntektToNumber(
      heltUttak.aarligInntektVsaPensjon?.beloep
    )
    if (harInntektVsaHelPensjon === true) {
      if (
        !heltUttak.aarligInntektVsaPensjon?.beloep ||
        heltUttak.aarligInntektVsaPensjon?.beloep === '0'
      ) {
        return 'Du må fylle ut inntekt'
      }
      if (isNaN(parsedInntekt)) {
        return 'Du må skrive hele tall med siffer for å oppgi inntekt'
      }
      if (parsedInntekt < 0) {
        return 'Inntekt kan ikke være negativ'
      }
      if (parsedInntekt > 100000000) {
        return 'Inntekten kan ikke overskride 100 000 000 kroner'
      }
    }
    return ''
  }, [heltUttak, harInntektVsaHelPensjon])

  const validateHeltUttakSluttAlder = useCallback((): string => {
    if (
      harInntektVsaHelPensjon &&
      heltUttak.aarligInntektVsaPensjon?.sluttAlder
    ) {
      if (heltUttak.aarligInntektVsaPensjon.sluttAlder.aar === null) {
        return 'Du må velge alder'
      }
      if (heltUttak.uttaksalder.aar) {
        if (
          heltUttak.aarligInntektVsaPensjon.sluttAlder.aar <=
          heltUttak.uttaksalder.aar
        ) {
          return 'Du må oppgi en senere alder for inntekt enn den du har oppgitt for helt uttak'
        }
      }
      if (gradertUttak?.uttaksalder.aar) {
        if (
          heltUttak.aarligInntektVsaPensjon.sluttAlder.aar <=
          gradertUttak.uttaksalder.aar
        ) {
          return 'Du må oppgi en senere alder for inntekt enn den du har oppgitt for gradert uttak'
        }
      }
    }
    return ''
  }, [harInntektVsaHelPensjon, heltUttak, gradertUttak?.uttaksalder])

  const [errorFields, setErrorFields] = useState<ErrorFields>({})

  const validateFields = useCallback(
    (step: StepName) => {
      const errors: ErrorFields = {}

      if (step === 'AlderStep') {
        if (!foedselAar) {
          errors.foedselAar = 'Du må oppgi årstall'
        } else if (isNaN(+foedselAar)) {
          errors.foedselAar =
            'Du må oppgi årstall med siffer (ÅÅÅÅ, f.eks. 1960)'
        } else if (
          +foedselAar < new Date().getFullYear() - 75 ||
          +foedselAar > new Date().getFullYear()
        ) {
          errors.foedselAar = 'Du må oppgi et gyldig årstall'
        } else {
          errors.foedselAar = ''
        }
        errors.inntektOver1GAntallAar = validateInntektOver1GAntallAar()
      }

      if (step === 'UtlandsStep') {
        errors.harBoddIUtland =
          harBoddIUtland === null ? 'Du må velge et alternativ' : ''
        errors.utenlandsAntallAar = validateUtenlandsAntallAar()
      }

      if (step === 'InntektStep') {
        errors.aarligInntektFoerUttakBeloep =
          validateAarligInntektFoerUttakBeloep()
        errors.uttaksgrad =
          gradertUttak && gradertUttak.grad === null
            ? 'Du må velge uttaksgrad'
            : ''
        errors.gradertUttaksalder = validateGradertUttak()
        errors.gradertInntekt = validateGradertInntekt()
        errors.heltUttaksalder = validateHelUttaksalder()
        errors.helPensjonInntekt = validateHelPensjonInntekt()
        errors.heltUttakSluttAlder = validateHeltUttakSluttAlder()
        errors.harInntektVsaHelPensjon =
          harInntektVsaHelPensjon === null ? 'Du må velge et alternativ' : ''
      }

      if (step === 'SivilstandStep') {
        errors.sivilstand = !sivilstand ? 'Du må velge et alternativ' : ''
        errors.epsHarInntektOver2G =
          sivilstand &&
          sivilstand !== 'UGIFT' &&
          epsHarInntektOver2G === undefined
            ? 'Du må velge et alternativ'
            : ''
        errors.epsHarPensjon =
          sivilstand && sivilstand !== 'UGIFT' && epsHarPensjon === undefined
            ? 'Du må velge et alternativ'
            : ''
      }

      if (step === 'AFPStep') {
        errors.simuleringstype = !simuleringstype
          ? 'Du må velge et alternativ'
          : ''
      }

      setErrorFields(errors)

      return Object.values(errors).some((error) => error !== '')
    },
    [
      validateInntektOver1GAntallAar,
      validateUtenlandsAntallAar,
      validateAarligInntektFoerUttakBeloep,
      validateGradertUttak,
      validateGradertInntekt,
      validateHelUttaksalder,
      validateHelPensjonInntekt,
      validateHeltUttakSluttAlder,
      harBoddIUtland,
      gradertUttak,
      foedselAar,
      harInntektVsaHelPensjon,
      sivilstand,
      simuleringstype,
      epsHarInntektOver2G,
      epsHarPensjon,
    ]
  )

  const handlers = useMemo(
    () => ({
      validateFields,
      clearError: (field: string) => {
        setErrorFields((prev) => ({ ...prev, [field]: '' }))
      },
    }),
    [validateFields]
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
