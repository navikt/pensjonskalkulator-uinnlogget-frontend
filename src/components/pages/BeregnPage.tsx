import React, { Suspense, useContext, useRef } from 'react'
import Beregn from '../Beregn'

import { FormContext } from '@/contexts/context'
import { Simuleringsresultat, State } from '@/common'
import LoadingComponent from '../LoadingComponent'
import submitForm from '@/functions/submitForm'

const useAsyncLoader = (
  asyncMethod: (state: State) => Promise<Simuleringsresultat | undefined>,
  state: State
) => {
  const storage = useRef<{
    resolved: boolean
    rejected: boolean
    promise?: Promise<Simuleringsresultat | undefined>
    result: Simuleringsresultat | undefined
  }>({
    resolved: false,
    rejected: false,
    promise: undefined,
    result: undefined,
  })

  return {
    loader: () => {
      // If the promise has been rejected, return
      if (storage.current.rejected) return
      // If the promise has been resolved, return the result
      if (storage.current.resolved) return storage.current.result
      // If the promise is ongoing, return the promise itself
      if (storage.current.promise) throw storage.current.promise

      storage.current.promise = asyncMethod(state)
        .then((res) => {
          storage.current.promise = undefined
          storage.current.resolved = true
          storage.current.result = res
          return res
        })
        .catch(() => {
          storage.current.promise = undefined
          storage.current.rejected = true
          return undefined
        })

      throw storage.current.promise
    },
  }
}

const AwaitComponent = ({
  loader,
  render,
}: {
  loader: () => Simuleringsresultat | undefined
  render: (
    simuleringsresultat: Simuleringsresultat | undefined
  ) => JSX.Element | null | undefined
}) => {
  const result = loader()
  return render(result)
}

function BeregnPage() {
  const { state } = useContext(FormContext)
  const { loader } = useAsyncLoader(submitForm, state)

  return (
    <Suspense fallback={<LoadingComponent />}>
      <AwaitComponent
        loader={loader}
        render={(simuleringsresultat: Simuleringsresultat | undefined) => (
          <Beregn simuleringsresultat={simuleringsresultat} />
        )}
      />
    </Suspense>
  )
}

export default BeregnPage
