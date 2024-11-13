import { State, Simuleringsresultat } from '@/common'
import { produce } from 'immer'

const transformPayload = (formState: State) => {
  const payload = produce(formState, (draft) => {
    if (
      draft.inntektVsaHelPensjon === 'nei' &&
      draft.heltUttak?.aarligInntektVsaPensjon?.beloep !== undefined &&
      draft.heltUttak.aarligInntektVsaPensjon.beloep > 0
    ) {
      draft.heltUttak.aarligInntektVsaPensjon.beloep = 0
    }
    if (
      draft.inntektVsaHelPensjon === 'nei' &&
      draft.heltUttak?.aarligInntektVsaPensjon &&
      draft.heltUttak?.aarligInntektVsaPensjon?.sluttAlder?.aar !== undefined
    ) {
      draft.heltUttak.aarligInntektVsaPensjon.sluttAlder = undefined
    }
    if (draft.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar === 0) {
      draft.heltUttak!.aarligInntektVsaPensjon.sluttAlder = undefined
    }
    if (draft.gradertUttak?.grad === 100) {
      draft.gradertUttak = undefined
    }
    if (draft.sivilstand === 'UGIFT') {
      draft.epsHarInntektOver2G = undefined
      draft.epsHarPensjon = undefined
    }
    if (draft.boddIUtland === 'nei') {
      draft.utenlandsAntallAar = 0
    }
  })

  const {
    boddIUtland: _boddIUtland,
    inntektVsaHelPensjon: _inntektVsaHelPensjon,
    ...apiPayload
  } = payload

  return apiPayload
}

const submitForm = async (
  formState: State
): Promise<Simuleringsresultat | undefined> => {
  const apiPayload = transformPayload(formState)

  return fetch('/pensjon/kalkulator-uinnlogget/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  })
    .then(async (response) => {
      if (response.ok) {
        return response
          .json()
          .then((jsonData) => {
            return JSON.parse(jsonData) as Simuleringsresultat
          })
          .catch(async () => {
            return Promise.reject('Error parsing JSON')
          })
      } else {
        return response
          .json()
          .then(() => {
            return Promise.reject('Error while fetching')
          })
          .catch(() => {
            return Promise.reject('Unhandled error')
          })
      }
    })
    .catch(() => {
      return Promise.reject('Unhandled error')
    })
}

export default submitForm
