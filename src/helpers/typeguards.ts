import { SimuleringError } from '@/common'

export const isSimuleringError = (error: unknown): error is SimuleringError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as SimuleringError).status === 'string' &&
    typeof (error as SimuleringError).message === 'string'
  )
}
