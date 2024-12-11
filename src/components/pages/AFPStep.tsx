import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { PropType, State } from '@/common'
import stepStyles from '../styles/stepStyles.module.css'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'

const AFPStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)

  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('AFPStep')
    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }

    return false
  }

  return (
    <FormWrapper onSubmit={onSubmit}>
      <h2 className={stepStyles.underOverskrift}>Avtalefestet pensjon (AFP)</h2>
      <RadioGroup
        legend={'Har du rett til AFP i privat sektor?'}
        className={stepStyles.componentSpacing}
        defaultValue={state.simuleringstype}
        onChange={(it: PropType<State, 'simuleringstype'>) =>
          handleFieldChange((draft) => {
            draft.simuleringstype = it
          }, 'simuleringType')
        }
        error={errorFields.simuleringstype}
      >
        <Radio value="ALDERSPENSJON_MED_AFP_PRIVAT">Ja</Radio>
        <Radio value="ALDERSPENSJON">Nei</Radio>
      </RadioGroup>
      <FormButtons />
    </FormWrapper>
  )
}

export default AFPStep
