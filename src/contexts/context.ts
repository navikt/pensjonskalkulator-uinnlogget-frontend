import { ContextForm } from '@/common'
import { initialFormState } from '@/defaults/defaultFormState'
import { createContext } from 'react'

const defaultFormPageProps = {
  curStep: 0,
  length: 0,
  goBack: () => {},
  onStepChange: () => {},
  handleSubmit: () => {},
  goToNext: () => {},
}

export const FormContext = createContext<ContextForm>({
  state: initialFormState,
  setState: () => {},
  formPageProps: defaultFormPageProps,
})
