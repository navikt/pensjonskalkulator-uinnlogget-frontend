import { useCallback } from 'react'

// Import immer for immutable state updates
import { State } from '@/common'
import { produce } from 'immer'

type UseFieldChangeProps<T> = {
  setState: React.Dispatch<React.SetStateAction<T>>
  clearError: (error: string) => void
}

// Custom hook to handle field changes using immer for deep updates
export const useFieldChange = <T extends State>({
  setState,
  clearError,
}: UseFieldChangeProps<T>) => {
  const handleFieldChange = useCallback(
    (updater: (state: T) => void, error: string) => {
      setState((prev) => produce(prev, updater)) // Use immer's `produce` to handle immutable updates
      clearError(error)
    },
    [setState, clearError]
  )

  return {
    handleFieldChange,
  }
}
