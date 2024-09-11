import { FormValues } from '@/common'

/* const submitForm = async (formstate: FormValues) => {
  console.log('Submitting form:', formstate)
  const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formstate
  console.log('Api payload', apiPayload)

  try{
    const csrfResponse = await fetch(
      'https://pensjonskalkulator-backend.intern.dev.nav.no/api/csrf', {
        method: 'GET',
        credentials: 'include'
      }
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
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(apiPayload),
        credentials: 'include'
      }
    )
  
    if (!response.ok) {
      console.log(await response.json())
      throw new Error('Failed to submit form')
    }
  
    const responseData = await response.json()
    console.log('Response:', responseData)
  } catch (error) {
    console.error(error)
  }
} */

const submitForm = async (formstate: FormValues) => {

  const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formstate
  console.log('Api payload', apiPayload)
  
  const response = await fetch('http://localhost:3000/pensjon/kalkulator-uinnlogget/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

  return response.json();

}

export default submitForm
