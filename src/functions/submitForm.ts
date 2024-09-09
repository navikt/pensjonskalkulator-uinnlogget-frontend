//'use server'

import { FormValues } from '@/common'

const submitForm = async (formstate: FormValues) => {

  const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formstate
  console.log('Api payload', apiPayload)

  try{
   
    // Make POST request with CSRF token
    const response = await fetch(
      '/api/v1/alderspensjon/anonym-simulering', //https://pensjonskalkulator-backend.intern.dev.nav.no/api/v1/alderspensjon/anonym-simulering
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
        credentials: 'include'
      }
    )
  
    if (!response.ok) {
      console.log(await response.json())
      throw new Error(`Failed to submit form: ${response.statusText}`)
    }
  
    const responseData = await response.json()
    console.log('Response:', responseData)

  } catch (error) {
    console.error(error)
  }
}

export default submitForm
