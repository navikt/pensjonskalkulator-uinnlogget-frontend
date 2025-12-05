'use client'

import { useEffect } from 'react'

import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler'

export default function ErrorHandler() {
  useEffect(() => {
    const initializeErrorHandling = async () => {
      try {
        // * Wait for decorator to fully load
        await awaitDecoratorData()

        // Only in development, suppress specific Amplitude errors
        if (process.env.NODE_ENV === 'development') {
          const originalError = console.error

          console.error = (...args: unknown[]) => {
            // * Check if this is an Amplitude Logger error
            const errorMessage = args.join(' ')
            if (
              errorMessage.includes('Amplitude Logger') &&
              errorMessage.includes('Failed to fetch remote configuration')
            ) {
              // Suppress this specific error in development
              console.warn(
                '[DEV] Suppressed Amplitude error (this is expected in development):',
                errorMessage
              )
              return
            }

            // * For all other errors, use the original console.error
            originalError.apply(console, args)
          }
        }
      } catch (error) {
        console.warn('Failed to initialize decorator data:', error)
      }
    }

    initializeErrorHandling()
  }, [])

  return null
}
