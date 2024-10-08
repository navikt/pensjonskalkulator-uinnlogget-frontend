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

  const context = useContext(FormContext) as ContextForm

  useEffect(() => {
    const resource = fetchBeregnData(context.states)
    setBeregnResource(resource)
  }, [context.states])

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Beregn resource={beregnResource} />
    </Suspense>
  )
}

export default BeregnPage
