import React, { useContext } from 'react'
import FormWrapper from '../FormWrapper'
import { Heading, Radio, RadioGroup, Select } from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { PropType, State } from '@/common'
import Substep from '../Substep'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'
import { formatInntekt } from './utils/inntekt'

interface FormPageProps {
  grunnbelop?: number
}

const SivilstandStep = ({ grunnbelop }: FormPageProps) => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('SivilstandStep')
    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }
    return false
  }

  return (
    <FormWrapper onSubmit={onSubmit}>
      <Heading level="2" size="medium">
        Sivilstand
      </Heading>
      <Select
        value={state.sivilstand}
        style={{ width: '5rem' }}
        label={'Hva er din sivilstand?'}
        onChange={(it) =>
          handleFieldChange((draft) => {
            draft.sivilstand =
              it.target.value === ''
                ? undefined
                : (it.target.value as PropType<State, 'sivilstand'>)
            if (draft.sivilstand === 'UGIFT') {
              draft.epsHarInntektOver2G = undefined
              draft.epsHarPensjon = undefined
            }
          }, 'sivilstand')
        }
        error={errorFields.sivilstand}
      >
        <option value={''}>----</option>
        <option value={'UGIFT'}>Ugift</option>
        <option value={'GIFT'}>Gift</option>
        <option value={'SAMBOER'}>Samboer</option>
      </Select>
      {state.sivilstand && state.sivilstand !== 'UGIFT' && (
        <>
          <Substep>
            <RadioGroup
              legend={`Har du ektefelle, partner eller samboer som har inntekt større enn ${
                grunnbelop ? `${formatInntekt(grunnbelop)} kr` : '2G'
              } når du starter å ta ut pensjon?`}
              defaultValue={state.epsHarInntektOver2G}
              onChange={(it: boolean) =>
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
              defaultValue={state.epsHarPensjon}
              onChange={(it: boolean) =>
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

export default SivilstandStep
