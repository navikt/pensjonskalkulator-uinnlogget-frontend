import { mapStateToApiPayload } from './map/apiPayloadMapper'
import { SimuleringError, Simuleringsresultat, State } from '@/common'

export const submitForm = async (
  formState: State
): Promise<Simuleringsresultat> => {
  const apiPayload = mapStateToApiPayload(formState)

  return fetch('/pensjon/uinnlogget-kalkulator/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  })
    .then(async (response) => {
      if (response.status === 409) {
        return response.json().then((data) => {
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
