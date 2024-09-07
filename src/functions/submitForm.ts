'use server'

import { FormValues } from '@/common'

const submitForm = async (formstate: FormValues) => {
  const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formstate
  console.log('Form submitted:', apiPayload)

  const csrfResponse = await fetch(
    'https://pensjonskalkulator-backend.intern.dev.nav.no/api/csrf'
  )

  if (!csrfResponse.ok) {
    throw new Error('Failed to fetch CSRF token')
  }

  const csrfData = await csrfResponse.json()
  const csrfToken = csrfData.token
  console.log('CSRF token:', csrfToken)
  // Make POST request with CSRF token
  const response = await fetch(
    'https://pensjonskalkulator-backend.intern.dev.nav.no/api/v1/alderspensjon/anonym-simulering',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'X-XSRF-TOKEN': csrfToken
      },
      body: JSON.stringify(apiPayload)
      // credentials: 'include'
    }
  )

  if (!response.ok) {
    console.log(await response.json())
    throw new Error('Failed to submit form')
  }

  const responseData = await response.json()
  console.log('Response:', responseData)
}

export default submitForm
