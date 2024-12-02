import { Alder, APIPayload, PropType, State } from '@/common'

export const mapStateToApiPayload = (s: State): APIPayload => {
  const {
    harBoddIUtland: _harBoddIUtland,
    harInntektVsaHelPensjon: _harInntektVsaHelPensjon,
    ...state
  } = s

  const aarligInntektVsaPensjonBeloepNumber = state.heltUttak
    .aarligInntektVsaPensjon?.beloep
    ? parseInt(state.heltUttak.aarligInntektVsaPensjon?.beloep)
    : 0

  const mappedGradertUttak: PropType<APIPayload, 'gradertUttak'> =
    state.gradertUttak && state.gradertUttak.grad !== null
      ? {
          ...state.gradertUttak,
          grad: state.gradertUttak.grad as number,
          uttakAlder: state.gradertUttak.uttakAlder as Alder,
          aarligInntektVsaPensjonBeloep: state.gradertUttak
            .aarligInntektVsaPensjonBeloep
            ? parseInt(state.gradertUttak.aarligInntektVsaPensjonBeloep)
            : 0,
        }
      : undefined

  const mappedHeltUttak: PropType<APIPayload, 'heltUttak'> = {
    ...state.heltUttak,
    uttakAlder: state.heltUttak.uttakAlder as Alder,
    aarligInntektVsaPensjon:
      state.heltUttak.aarligInntektVsaPensjon?.sluttAlder &&
      s.harInntektVsaHelPensjon
        ? {
            beloep: !s.harInntektVsaHelPensjon
              ? 0
              : aarligInntektVsaPensjonBeloepNumber,
            sluttAlder:
              state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar === null
                ? undefined
                : {
                    aar: state.heltUttak.aarligInntektVsaPensjon?.sluttAlder
                      .aar as number,
                    maaneder: state.heltUttak.aarligInntektVsaPensjon
                      ?.sluttAlder.maaneder as number,
                  },
          }
        : undefined,
  }
  return {
    ...state,
    foedselAar: parseInt(state.foedselAar as string),
    utenlandsAntallAar: state.utenlandsAntallAar
      ? parseInt(state.utenlandsAntallAar as string)
      : 0,
    inntektOver1GAntallAar: state.inntektOver1GAntallAar
      ? parseInt(state.inntektOver1GAntallAar)
      : 0,
    aarligInntektFoerUttakBeloep: state.aarligInntektFoerUttakBeloep
      ? parseInt(state.aarligInntektFoerUttakBeloep)
      : 0,
    gradertUttak: mappedGradertUttak,
    heltUttak: mappedHeltUttak,
  }
}
