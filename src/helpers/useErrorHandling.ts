import { useState, useMemo } from 'react';
import { FormValues } from '@/common';

const useErrorHandling = (states: FormValues) => {
  const [errorFields, setErrorFields] = useState<{ [key: string]: string | null }>({});

  const validateFields = (step: string) => {

    const errors: { [key: string]: string | null } = {
      foedselAar: states.foedselAar < 1900 || states.foedselAar > new Date().getFullYear() ? 'Du må oppgi et gyldig årstall' : null,
      inntektOver1GAntallAar: states.inntektOver1GAntallAar === 0 || states.inntektOver1GAntallAar < 0 || states.inntektOver1GAntallAar > 10 ? 'Fyll ut antall år' : null, //hmmm, skal det virkelig være maks 10? Spør Espen hva inntektOver1GAntallAar er
      boddIUtland: !states.boddIUtland ? 'Du må velge et alternativ' : null,
      utenlandsAntallAar: (states.utenlandsAntallAar === 0 && states.boddIUtland === "ja") ? 'Du må fylle ut antall år' : null,
      aarligInntektFoerUttakBeloep: states.aarligInntektFoerUttakBeloep === 0 ? 'Du må fylle ut inntekt' : states.aarligInntektFoerUttakBeloep < 0 ? 'Inntekt kan ikke være negativ' : null,
      uttaksgrad: states.gradertUttak.grad === 0 ? 'Du må velge uttaksgrad' : null,
      gradertInntekt: states.gradertUttak.grad > 0 && states.gradertUttak.grad !== 100 && (!states.gradertUttak.aarligInntektVsaPensjonBeloep ? 'Du må fylle ut inntekt' : states.gradertUttak.aarligInntektVsaPensjonBeloep < 0 ? 'Inntekt kan ikke være negativ' : null) || null,
      gradertAar: states.gradertUttak.grad > 0 && states.gradertUttak.grad !== 100 && (states.gradertUttak.uttakAlder.aar === null || states.gradertUttak.uttakAlder.aar === -1) ? 'Du må velge alder' : null,
      gradertMaaneder: states.gradertUttak.grad > 0 && states.gradertUttak.grad !== 100 && (states.gradertUttak.uttakAlder.maaneder === null || states.gradertUttak.uttakAlder.maaneder === -1) ? 'Du må velge måned' : null,
      helPensjonInntekt: states.inntektVsaHelPensjon === 'ja' && (!states.heltUttak.aarligInntektVsaPensjon.beloep ? 'Du må fylle ut inntekt' : states.heltUttak.aarligInntektVsaPensjon.beloep < 0 ? 'Inntekt kan ikke være negativ' : null) || null,
      heltUttakAar: !states.heltUttak.uttakAlder.aar || states.heltUttak.uttakAlder.aar === -1 ? 'Du må velge alder' : null,
      heltUttakMaaneder: states.heltUttak.uttakAlder.maaneder === null || states.heltUttak.uttakAlder.maaneder === -1 ? 'Du må velge måned' : null,
      inntektVsaHelPensjon: states.inntektVsaHelPensjon === '' ? 'Velg alternativ' : null,
      sivilstand: !states.sivilstand ? 'Du må velge et alternativ' : null,
      epsHarInntektOver2G: states.sivilstand !== 'UGIFT' && states.epsHarInntektOver2G === null ? 'Du må velge et alternativ' : null,
      epsHarPensjon: states.sivilstand !== 'UGIFT' && states.epsHarPensjon === null ? 'Du må velge et alternativ' : null,
      simuleringType: !states.simuleringType ? 'Du må velge et alternativ' : null,
    };

    let errorStep: { [key: string]: string | null } = {};

    if(step === 'AlderStep'){
      const { boddIUtland, utenlandsAntallAar, aarligInntektFoerUttakBeloep, uttaksgrad, gradertInntekt, gradertAar, gradertMaaneder, helPensjonInntekt, heltUttakAar, heltUttakMaaneder, inntektVsaHelPensjon, sivilstand, epsHarInntektOver2G, epsHarPensjon, simuleringType, ...rest } = errors;
      errorStep = rest;
    }
    if(step === 'UtlandsStep'){
      const { foedselAar, inntektOver1GAntallAar, aarligInntektFoerUttakBeloep, uttaksgrad, gradertInntekt, gradertAar, gradertMaaneder, helPensjonInntekt, heltUttakAar, heltUttakMaaneder, inntektVsaHelPensjon, sivilstand, epsHarInntektOver2G, epsHarPensjon, simuleringType, ...rest } = errors;
      errorStep = rest;
    }
    if(step === 'InntektStep'){
      const { foedselAar, inntektOver1GAntallAar, boddIUtland, utenlandsAntallAar, sivilstand, epsHarInntektOver2G, epsHarPensjon, simuleringType, ...rest } = errors;
      errorStep = rest;
    }
    if(step === 'EktefelleStep'){
      const { boddIUtland, utenlandsAntallAar, foedselAar, inntektOver1GAntallAar, aarligInntektFoerUttakBeloep, uttaksgrad, gradertInntekt, gradertAar, gradertMaaneder, helPensjonInntekt, heltUttakAar, heltUttakMaaneder, inntektVsaHelPensjon, simuleringType, ...rest } = errors;
      errorStep = rest;
    }
    if(step === 'AFPStep'){
      const { boddIUtland, utenlandsAntallAar, foedselAar, inntektOver1GAntallAar, aarligInntektFoerUttakBeloep, uttaksgrad, gradertInntekt, gradertAar, gradertMaaneder, helPensjonInntekt, heltUttakAar, heltUttakMaaneder, inntektVsaHelPensjon, sivilstand, epsHarInntektOver2G, epsHarPensjon, ...rest } = errors;
      errorStep = rest;
    }

    console.log('Errors', errorStep);

    setErrorFields(errorStep);
    console.log(Object.values(errorStep).some(error => error !== null));

    return Object.values(errorStep).some(error => error !== null);
  };

  const handlers = useMemo(
    () => ({
      validateFields,
      clearError: (field: string | null) => {
        if(field !== null){
          setErrorFields((prev) => ({ ...prev, [field]: '' }));
        }
      },
    }),
    [states]
  );

  return [errorFields, handlers] as const;
};

export default useErrorHandling;