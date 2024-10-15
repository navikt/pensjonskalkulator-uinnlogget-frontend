import { ContextForm } from '@/common'
import { createContext } from 'react'

import { initialFormState } from '@/components/FormPage'

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
