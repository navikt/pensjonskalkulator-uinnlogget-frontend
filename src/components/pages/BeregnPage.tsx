import React, { Suspense, useContext, useEffect, useState } from 'react'
import Beregn from '../Beregn'
import { FormValueResult, State } from '@/common'
import wrapPromise from '@/utils/wrapPromise'
import submitForm from '@/functions/submitForm'
import { FormContext } from '@/contexts/context'

import LoadingComponent from '../LoadingComponent'
import { produce } from 'immer'

export function fetchBeregnData(formState: State) {
  return wrapPromise(
    submitForm(formState).then((data) => JSON.parse(data) as FormValueResult)
  )
}

// The resource itself is just the object returned by wrapPromise
interface Resource {
  read(): FormValueResult | undefined
}

function BeregnPage() {
  const [beregnResource, setBeregnResource] = useState<Resource>({
    read: () => undefined,
  })

  const { state, setState } = useContext(FormContext)

  useEffect(() => {
    const payload = produce(state, (draft) => {
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
    })

    setState(payload)

    const resource = fetchBeregnData(payload)
    setBeregnResource(resource)
  }, [])

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Beregn resource={beregnResource} />
    </Suspense>
  )
}

export default BeregnPage
