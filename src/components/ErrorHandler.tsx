'use client'

import { useEffect } from 'react'

import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler'

export default function ErrorHandler() {
  useEffect(() => {
    let originalError: (typeof console)['error'] | null = null

    const initializeErrorHandling = async () => {
      try {
        // * Wait for decorator to fully load
        await awaitDecoratorData()

        // Only in development, suppress specific Amplitude errors
        if (process.env.NODE_ENV === 'development') {
          if ('__amplitudePatched' in console) return

          originalError = console.error
          ;(console as unknown as Record<string, boolean>)[
            '__amplitudePatched'
          ] = true

          console.error = (...args: unknown[]) => {
            // * Check if this is an Amplitude Logger error
            const errorMessage = args.join(' ')
            if (
              (errorMessage.includes('Amplitude Logger') &&
                errorMessage.includes(
                  'Failed to fetch remote configuration'
                )) ||
              errorMessage.includes('Failed to fetch session')
            ) {
              // Suppress this specific error in development
              console.warn(
                '[DEV] Suppressed decorator/Amplitude error (expected in development):',
                errorMessage
              )
              return
            }

            // * For all other errors, use the original console.error
            originalError!.apply(console, args)
          }
        }
      } catch (error) {
        console.warn('Failed to initialize decorator data:', error)
      }
    }

    initializeErrorHandling()

    // Cleanup: restore original console.error on unmount
    return () => {
      if (originalError) {
        console.error = originalError
        delete (console as unknown as Record<string, boolean>)[
          '__amplitudePatched'
        ]
      }
    }
  }, [])

  return null
}
