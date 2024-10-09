import React, { Suspense, useContext, useEffect, useState } from 'react'
import Beregn from '../Beregn'
import { ContextForm, FormValueResult, FormValues } from '@/common'
import wrapPromise from '@/utils/wrapPromise'
import submitForm from '@/functions/submitForm'
import { FormContext } from '@/contexts/context'

import LoadingComponent from '../LoadingComponent'

function fetchBeregnData(formState: FormValues) {
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

  const { states, setState } = useContext(FormContext) as ContextForm

  useEffect(() => {
    const payload = { ...states }

    if (
      payload.inntektVsaHelPensjon === 'nei' &&
      payload.heltUttak?.aarligInntektVsaPensjon?.beloep !== undefined &&
      payload.heltUttak.aarligInntektVsaPensjon.beloep > 0
    ) {
      payload.heltUttak.aarligInntektVsaPensjon!.beloep = 0
    }
    if (
      payload.inntektVsaHelPensjon == 'nei' &&
      payload.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar !== 0 &&
      payload.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.maaneder !== -1
    ) {
      payload.heltUttak!.aarligInntektVsaPensjon!.sluttAlder = undefined
    }
    if (payload.gradertUttak?.grad === 100) {
      payload.gradertUttak = undefined
    }

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
