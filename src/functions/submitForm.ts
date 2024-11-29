import {
  APIPayload,
  State,
  Simuleringsresultat,
  SimuleringError,
} from '@/common'
import { produce } from 'immer'
import apiPayloadMapper from './map/apiPyaloadMapper'

export const transformPayload = (formState: State): APIPayload => {
  const payload = produce(formState, (draft) => {
    if (
      draft.harInntektVsaHelPensjon === false &&
      draft.heltUttak.aarligInntektVsaPensjon?.beloep &&
      +draft.heltUttak.aarligInntektVsaPensjon?.beloep > 0
    ) {
      draft.heltUttak.aarligInntektVsaPensjon = undefined
    }
    if (draft.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar === null) {
      draft.heltUttak!.aarligInntektVsaPensjon.sluttAlder = undefined
    }
    if (draft.gradertUttak?.grad === null) {
      draft.gradertUttak = undefined
    }
  })

  const {
    harBoddIUtland: _harBoddIUtland,
    harInntektVsaHelPensjon: _harInntektVsaHelPensjon,
    ...apiPayload
  } = payload

  return apiPayloadMapper(apiPayload as State)
}

export const submitForm = async (
  formState: State
): Promise<Simuleringsresultat> => {
  const apiPayload = transformPayload(formState)

  return fetch('/pensjon/kalkulator-uinnlogget/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  })
    .then(async (response) => {
      if (response.status === 409) {
        return response.json().then((data) => {
          console.log('Threw 409 conflict error:', data)
          return Promise.reject(JSON.parse(data) as SimuleringError)
        })
      } else if (response.ok) {
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
    .catch((err) => {
      return Promise.reject(err)
    })
}
