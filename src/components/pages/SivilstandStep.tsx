import { PropType, State } from '@/common'
import { FormContext } from '@/contexts/context'
import { useFieldChange } from '@/helpers/useFormState'
import { Box, Radio, RadioGroup, Select } from '@navikt/ds-react'
import { useContext } from 'react'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import FormWrapper from '../FormWrapper'
import '../styles/selectStyle.css'
import stepStyles from '../styles/stepStyles.module.css'
import Substep from '../Substep'
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
      <h2 className={stepStyles.underOverskrift}>Sivilstand</h2>
      <Box className={stepStyles.componentSpacing}>
        <Select
          value={state.sivilstand}
          className="selectSivilstand"
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
      </Box>
      {state.sivilstand && state.sivilstand !== 'UGIFT' && (
        <>
          <Substep>
            <RadioGroup
              legend={`Har din ektefelle, partner eller samboer inntekt større enn ${
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
              <Radio
                data-has-error={errorFields.epsHarInntektOver2G ? true : false}
                value={true}
              >
                Ja
              </Radio>
              <Radio value={false}>Nei</Radio>
            </RadioGroup>
          </Substep>
          <Substep>
            <RadioGroup
              legend={
                'Har din ektefelle, partner eller samboer pensjon eller uføretrygd fra folketrygden (Nav) eller AFP når du starter å ta ut pensjon?'
              }
              defaultValue={state.epsHarPensjon}
              onChange={(it: boolean) =>
                handleFieldChange((draft) => {
                  draft.epsHarPensjon = it
                }, 'epsHarPensjon')
              }
              error={errorFields.epsHarPensjon}
            >
              <Radio
                data-has-error={errorFields.epsHarPensjon ? true : false}
                value={true}
              >
                Ja
              </Radio>
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
