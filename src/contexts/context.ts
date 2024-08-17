import { ContextForm } from '@/common'
import { createContext } from 'react'

export const FormContext = createContext<ContextForm | undefined>(undefined)
