import { Values } from '@/app/form/page'
import { Dispatch } from 'react'

const addState = (
  value: string,
  setState: Dispatch<React.SetStateAction<Values>>,
  step: string
) => {
  setState((prev) => {
    const newState = { ...prev }
    // Check if 'alder' exists and update or add it
    if (newState[step]) {
      newState[step].state = value
    } else {
      newState[step] = { state: value }
    }

    return newState
  })
}

export default addState
