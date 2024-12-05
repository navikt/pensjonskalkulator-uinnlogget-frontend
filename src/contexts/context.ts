import { ContextForm } from '@/common'
import { initialState } from '@/defaults/initialState'
import { createContext } from 'react'

const defaultFormPageProps = {
  curStep: 0,
  length: 0,
  goBack: () => {},
  goTo: () => {},
  handleSubmit: () => {},
  goToNext: () => {},
}

export const FormContext = createContext<ContextForm>({
  state: initialState,
  setState: () => {},
  formPageProps: defaultFormPageProps,
})
