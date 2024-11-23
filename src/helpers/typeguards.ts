import { AnonymSimuleringError } from '@/common'

export const isAnonymSimuleringError = (
  error: unknown
): error is AnonymSimuleringError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as AnonymSimuleringError).error?.status === 'string'
  )
}
