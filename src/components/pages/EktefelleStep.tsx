import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Radio, RadioGroup, Select } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues } from '@/common'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'

interface FormPageProps {
  grunnbelop: number
}

const EktefelleStep = ({ grunnbelop }: FormPageProps) => {
  const { states, setState, formPageProps } = useContext(
    FormContext
  ) as ContextForm
  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const handleFieldChange = (
    field: keyof FormValues,
    value: string | boolean | null
  ) => {
    setState((prev: FormValues) => ({
      ...prev,
      [field]: value,
    }))
    clearError(field)

    if (field === 'sivilstand' && value === 'UGIFT') {
      if (states.epsHarInntektOver2G !== undefined) {
        setState((prev: FormValues) => ({
          ...prev,
          ['epsHarInntektOver2G']: undefined,
        }))
      }
      if (states.epsHarPensjon !== undefined) {
        setState((prev: FormValues) => ({
          ...prev,
          ['epsHarPensjon']: undefined,
        }))
      }
    }
  }

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
          onChange={(it) => handleFieldChange('sivilstand', it.target.value)}
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
              value={states.epsHarInntektOver2G}
              onChange={(it) => handleFieldChange('epsHarInntektOver2G', it)}
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
              value={states.epsHarPensjon}
              onChange={(it) => handleFieldChange('epsHarPensjon', it)}
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
