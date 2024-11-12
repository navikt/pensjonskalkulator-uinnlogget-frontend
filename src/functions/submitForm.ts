import { State, FormValueResult } from '@/common'

const submitForm = (
  formstate: State
): { read: () => FormValueResult | undefined } => {
  const promise = (async () => {
    try {
      const {
        boddIUtland: _boddIUtland,
        inntektVsaHelPensjon: _inntektVsaHelPensjon,
        ...apiPayload
      } = formstate

      console.log('API Payload:', apiPayload)

      const response = await fetch(
        '/pensjon/kalkulator-uinnlogget/api/simuler',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiPayload),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.log('API Error data:', errorData)
        throw {
          message: errorData.message || 'Failed to submit form',
          status: errorData.status,
        }
      }

      const responseData = await response.json()
      if (!responseData) {
        return undefined
      }
      return JSON.parse(responseData)
    } catch (error) {
      throw error
    }
  })()

  let status = 'pending'
  let result: FormValueResult

  const suspender = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    }
  )

  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        if (result === undefined) {
          throw new Error('Result is undefined')
        }
        return result
      }
    },
  }
}

export default submitForm
