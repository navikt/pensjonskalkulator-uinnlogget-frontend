import { FormValues } from '@/common'

const submitForm = async (formstate: FormValues) => {
  const {
    boddIUtland: _boddIUtland,
    inntektVsaHelPensjon: _inntektVsaHelPensjon,
    ...apiPayload
  } = formstate
  console.log('Api payload', apiPayload)

  const response = await fetch('/pensjon/kalkulator-uinnlogget/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  })

  if (!response.ok) {
    throw {
      message: 'Failed to submit form',
      status: response.status,
    }
  }

  return response.json()
}

export default submitForm
