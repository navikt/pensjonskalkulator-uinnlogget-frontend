import { useState, useMemo } from 'react'
import { FormValues } from '@/common'

const useErrorHandling = (states: FormValues) => {
  const validateFields = (step: string) => {
    const errors: { [key: string]: string | null } = {
      foedselAar:
        states.foedselAar < 1900 || states.foedselAar > new Date().getFullYear()
          ? 'Du må oppgi et gyldig årstall'
          : null,
      inntektOver1GAntallAar:
        states.inntektOver1GAntallAar === undefined
          ? null
          : states.inntektOver1GAntallAar === 0
            ? 'Fyll ut antall år'
            : states.inntektOver1GAntallAar < 0
              ? 'Antall år kan ikke være negativt'
              : null,
      boddIUtland: !states.boddIUtland ? 'Du må velge et alternativ' : null,
      utenlandsAntallAar:
        states.utenlandsAntallAar !== undefined
          ? states.utenlandsAntallAar === 0 && states.boddIUtland === 'ja'
            ? 'Du må fylle ut antall år'
            : states.utenlandsAntallAar < 0
              ? 'Antall år må være positiv'
              : null
          : null,
      aarligInntektFoerUttakBeloep:
        states.aarligInntektFoerUttakBeloep === undefined
          ? 'Du må fylle ut inntekt'
          : states.aarligInntektFoerUttakBeloep === 0
            ? 'Inntekt kan ikke være 0'
            : states.aarligInntektFoerUttakBeloep < 0
              ? 'Inntekt kan ikke være negativ'
              : null,
      uttaksgrad:
        states.gradertUttak?.grad === 0 ? 'Du må velge uttaksgrad' : null,
      gradertInntekt:
        (states.gradertUttak !== undefined &&
          states.gradertUttak?.grad > 0 &&
          states.gradertUttak.grad !== 100 &&
          (!states.gradertUttak.aarligInntektVsaPensjonBeloep
            ? 'Du må fylle ut inntekt'
            : states.gradertUttak.aarligInntektVsaPensjonBeloep < 0
              ? 'Inntekt kan ikke være negativ'
              : null)) ||
        null,
      gradertAar:
        states.gradertUttak !== undefined &&
        states.gradertUttak.grad > 0 &&
        states.gradertUttak.grad !== 100 &&
        states.gradertUttak.uttakAlder.aar === 0
          ? 'Du må velge alder'
          : null,
      gradertMaaneder:
        states.gradertUttak !== undefined &&
        states.gradertUttak.grad > 0 &&
        states.gradertUttak.grad !== 100 &&
        states.gradertUttak.uttakAlder.maaneder === -1
          ? 'Du må velge måned'
          : null,
      helPensjonInntekt:
        (states.inntektVsaHelPensjon === 'ja' &&
          (!states.heltUttak.aarligInntektVsaPensjon?.beloep
            ? 'Du må fylle ut inntekt'
            : states.heltUttak.aarligInntektVsaPensjon.beloep < 0
              ? 'Inntekt kan ikke være negativ'
              : null)) ||
        null,
      heltUttakAar:
        !states.heltUttak.uttakAlder.aar ||
        states.heltUttak.uttakAlder.aar === 0
          ? 'Du må velge alder'
          : null,
      heltUttakMaaneder:
        !states.heltUttak.uttakAlder.maaneder ||
        states.heltUttak.uttakAlder.maaneder === -1
          ? 'Du må velge måned'
          : null,
      heltUttakSluttAlderMaaneder:
        states.heltUttak.aarligInntektVsaPensjon?.sluttAlder &&
        states.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar !== 0 &&
        states.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder === -1
          ? 'Du må velge måned'
          : null,
      inntektVsaHelPensjon:
        states.inntektVsaHelPensjon === '' ? 'Velg alternativ' : null,
      sivilstand: !states.sivilstand ? 'Du må velge et alternativ' : null,
      epsHarInntektOver2G:
        states.sivilstand !== 'UGIFT' &&
        states.epsHarInntektOver2G === undefined
          ? 'Du må velge et alternativ'
          : null,
      epsHarPensjon:
        states.sivilstand !== 'UGIFT' && states.epsHarPensjon === undefined
          ? 'Du må velge et alternativ'
          : null,
      simuleringType:
        states.simuleringType === undefined
          ? 'Du må velge et alternativ'
          : null,
    }

    let errorStep: { [key: string]: string | null } = {}

    if (step === 'AlderStep') {
      const {
        foedselAar: _foedselAar,
        inntektOver1GAntallAar: _inntektOver1GAntallAar,
      } = errors
      errorStep = {
        foedselAar: _foedselAar,
        inntektOver1GAntallAar: _inntektOver1GAntallAar,
      }
    }
    if (step === 'UtlandsStep') {
      const {
        boddIUtland: _boddIUtland,
        utenlandsAntallAar: _utenlandsAntallAar,
      } = errors
      errorStep = {
        boddIUtland: _boddIUtland,
        utenlandsAntallAar: _utenlandsAntallAar,
      }
    }
    if (step === 'InntektStep') {
      const {
        foedselAar: _foedselAar,
        inntektOver1GAntallAar: _inntektOver1GAntallAar,
        boddIUtland: _boddIUtland,
        utenlandsAntallAar: _utenlandsAntallAar,
        sivilstand: _sivilstand,
        epsHarInntektOver2G: _epsHarInntektOver2G,
        epsHarPensjon: _epsHarPensjon,
        simuleringType: _simuleringType,
        ...rest
      } = errors
      errorStep = rest
    }
    if (step === 'EktefelleStep') {
      const {
        sivilstand: _sivilstand,
        epsHarInntektOver2G: _epsHarInntektOver2G,
        epsHarPensjon: _epsHarPensjon,
      } = errors
      errorStep = {
        sivilstand: _sivilstand,
        epsHarInntektOver2G: _epsHarInntektOver2G,
        epsHarPensjon: _epsHarPensjon,
      }
    }
    if (step === 'AFPStep') {
      const { simuleringType: _simuleringType } = errors
      errorStep = { simuleringType: _simuleringType }
    }

    setErrorFields(errorStep)

    return Object.values(errorStep).some((error) => error !== null)
  }

  const [errorFields, setErrorFields] = useState<{
    [key: string]: string | null
  }>({})

  const handlers = useMemo(
    () => ({
      validateFields,
      clearError: (field: string | null) => {
        if (field !== null) {
          setErrorFields((prev) => ({ ...prev, [field]: '' }))
        }
      },
    }),
    [states]
  )

  return [errorFields, handlers] as const
}

export default useErrorHandling
