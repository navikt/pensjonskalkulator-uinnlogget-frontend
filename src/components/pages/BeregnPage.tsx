import { type JSX, Suspense, useContext, useRef } from 'react'

import Beregn from '../Beregn'
import LoadingComponent from '../LoadingComponent'
import { SimuleringError, Simuleringsresultat, State } from '@/common'
import { FormContext } from '@/contexts/context'
import { submitForm } from '@/functions/submitForm'
import { isSimuleringError } from '@/helpers/typeguards'

const useAsyncLoader = (
  asyncMethod: (state: State) => Promise<Simuleringsresultat | undefined>,
  state: State
) => {
  const storage = useRef<{
    resolved: boolean
    rejected: boolean
    promise?: Promise<Simuleringsresultat | undefined>
    result: Simuleringsresultat | undefined
    error: SimuleringError | undefined
  }>({
    resolved: false,
    rejected: false,
    promise: undefined,
    result: undefined,
    error: undefined,
  })

  return {
    loader: () => {
      // If the promise has been rejected, return error
      if (storage.current.rejected) return storage.current.error
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
        .catch((err) => {
          storage.current.promise = undefined
          storage.current.rejected = true

          if (isSimuleringError(err)) {
            storage.current.error = err
          }
          return err
        })

      throw storage.current.promise
    },
  }
}

const AwaitComponent = ({
  loader,
  render,
}: {
  loader: () => Simuleringsresultat | SimuleringError | undefined
  render: (
    simuleringsresultat: Simuleringsresultat | SimuleringError | undefined
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
        render={(
          simuleringsresultat: Simuleringsresultat | SimuleringError | undefined
        ) => <Beregn simuleringsresultat={simuleringsresultat} />}
      />
    </Suspense>
  )
}

export default BeregnPage
