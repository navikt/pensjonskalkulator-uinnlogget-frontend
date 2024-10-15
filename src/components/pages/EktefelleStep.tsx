import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup, Select } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues } from '@/common'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'

interface FormPageProps {
  grunnbelop: number
}

const EktefelleStep = ({ grunnbelop }: FormPageProps) => {
  const { states, setState, formPageProps } = useContext(
    FormContext
  ) as ContextForm
  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const { handleFieldChange } = useFieldChange<FormValues>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('EktefelleStep')
    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }
    return false
  }

  return (
    <FormWrapper onSubmit={onSubmit}>
      <Substep>
        <Select
          value={states.sivilstand}
          style={{ width: '5rem' }}
          label={'Hva er din sivilstand?'}
          onChange={(it) =>
            handleFieldChange((draft) => {
              draft.sivilstand = it.target.value
            }, 'sivilstand')
          }
          error={errorFields.sivilstand}
        >
          <option value={'UGIFT'}>Ugift</option>
          <option value={'GIFT'}>Gift</option>
          <option value={'SAMBOER'}>Samboer</option>
        </Select>
      </Substep>
      {states.sivilstand !== 'UGIFT' && (
        <>
          <Substep>
            <RadioGroup
              legend={`Har du ektefelle, partner eller samboer som har inntekt større enn ${
                2 * grunnbelop
              }kr når du starter å ta ut pensjon?`}
              defaultValue={states.epsHarInntektOver2G}
              onChange={(it) =>
                handleFieldChange((draft) => {
                  draft.epsHarInntektOver2G = it
                }, 'epsHarInntektOver2G')
              }
              error={errorFields.epsHarInntektOver2G}
            >
              <Radio value={true}>Ja</Radio>
              <Radio value={false}>Nei</Radio>
            </RadioGroup>
          </Substep>
          <Substep>
            <RadioGroup
              legend={
                'Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?'
              }
              defaultValue={states.epsHarPensjon}
              onChange={(it) =>
                handleFieldChange((draft) => {
                  draft.epsHarPensjon = it
                }, 'epsHarPensjon')
              }
              error={errorFields.epsHarPensjon}
            >
              <Radio value={true}>Ja</Radio>
              <Radio value={false}>Nei</Radio>
            </RadioGroup>
          </Substep>
        </>
      )}
      <FormButtons />
    </FormWrapper>
  )
}

export default EktefelleStep
