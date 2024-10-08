import { FormValueResult } from '@/common'

export default function wrapPromise(promise: Promise<FormValueResult>) {
  let status = 'pending'
  let result: FormValueResult
  const suspender = promise.then(
    (res) => {
      status = 'success'
      result = res
    },
    (err) => {
      status = 'error'
      result = err
    }
  )

  return {
    read() {
      if (status === 'pending') {
        throw suspender // Suspense will catch this and show fallback
      } else if (status === 'error') {
        throw result // Error boundary will catch this
      } else if (status === 'success') {
        return result
      }
    },
  }
}
