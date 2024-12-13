import { PropType, State } from '@/common'
import { FormContext } from '@/contexts/context'
import { useFieldChange } from '@/helpers/useFormState'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { useContext } from 'react'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import FormWrapper from '../FormWrapper'
import stepStyles from '../styles/stepStyles.module.css'

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
        <Radio
          data-has-error={errorFields.simuleringstype ? true : false}
          value="ALDERSPENSJON_MED_AFP_PRIVAT"
        >
          Ja
        </Radio>
        <Radio value="ALDERSPENSJON">Nei</Radio>
      </RadioGroup>
      <FormButtons />
    </FormWrapper>
  )
}

export default AFPStep
