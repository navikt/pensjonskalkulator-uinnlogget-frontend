import React, { Suspense, useContext } from 'react'
import Beregn from '../Beregn'
import submitForm from '@/functions/submitForm'
import { FormContext } from '@/contexts/context'

import LoadingComponent from '../LoadingComponent'

function BeregnPage() {
  const { state } = useContext(FormContext)
  const asyncSimuleringsresultat = submitForm(state)

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Beregn asyncSimuleringsresultat={asyncSimuleringsresultat} />
    </Suspense>
  )
}

export default BeregnPage
