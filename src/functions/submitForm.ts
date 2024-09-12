import { FormValues } from '@/common'

const submitForm = async (formstate: FormValues) => {

  const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formstate
  console.log('Api payload', apiPayload)
  
  const response = await fetch('/pensjon/kalkulator-uinnlogget/api/simuler', { //http://localhost:3000/pensjon/kalkulator-uinnlogget/api/simuler
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
