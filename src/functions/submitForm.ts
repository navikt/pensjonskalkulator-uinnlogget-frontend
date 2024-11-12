import { State, Simuleringsresultat } from '@/common'

const transformPayload = (formState: State) => {
  const draft = { ...formState }

  if (
    draft.inntektVsaHelPensjon === 'nei' &&
    draft.heltUttak?.aarligInntektVsaPensjon?.beloep !== undefined &&
    draft.heltUttak.aarligInntektVsaPensjon.beloep > 0
  ) {
    draft.heltUttak.aarligInntektVsaPensjon!.beloep = 0
  }
  if (
    draft.inntektVsaHelPensjon === 'nei' &&
    draft.heltUttak?.aarligInntektVsaPensjon?.sluttAlder?.aar !== undefined
  ) {
    draft.heltUttak.aarligInntektVsaPensjon!.sluttAlder = undefined
  }
  if (draft.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar === 0) {
    draft.heltUttak!.aarligInntektVsaPensjon!.sluttAlder = undefined
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

  const {
    boddIUtland: _boddIUtland,
    inntektVsaHelPensjon: _inntektVsaHelPensjon,
    ...apiPayload
  } = draft

  return apiPayload
}

const submitForm = (formState: State) => {
  const apiPayload = transformPayload(formState)

  let data: Simuleringsresultat | undefined

  fetch('/pensjon/kalkulator-uinnlogget/api/simuler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload),
  })
    .then((response) => {
      if (response.ok) {
        response
          .json()
          .then((jsonData) => {
            data = jsonData
          })
          .catch(async () => {
            // TODO feilhåndtering ved feil i json parsing
          })
      } else {
        response
          .json()
          .then((error) => {
            // TODO feilhåndtering ved error
            console.log('>>> Error:', error)
          })
          .catch(() => {
            //      TODO feilhåndtering ved error
          })
      }
    })
    .catch(() => {
      //      TODO feilhåndtering ved feil i manipulering
    })

  return {
    read() {
      if (!data) {
        return undefined
      }
      return data
    },
  }
}

export default submitForm
