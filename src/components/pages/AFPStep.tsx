import { PropType, State } from '@/common'
import { FormContext } from '@/contexts/context'
import { useFieldChange } from '@/helpers/useFormState'
import { Heading, Radio, RadioGroup, ReadMore } from '@navikt/ds-react'
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
      <Heading level="2" size="medium" className={stepStyles.underOverskrift}>
        Avtalefestet pensjon (AFP)
      </Heading>
      <RadioGroup
        legend={'Har du rett til AFP i privat sektor?'}
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
      <ReadMore
        header="Om AFP i privat sektor"
        className={stepStyles.componentSpacing}
      >
        AFP i privat sektor er et tillegg til alderspensjonen. Er du usikker på
        om du har rett til AFP i privat sektor, bør du sjekke det med
        arbeidsgiveren din.
      </ReadMore>
      <FormButtons />
    </FormWrapper>
  )
}

export default AFPStep
