import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import { useFieldChange } from '@/helpers/useFormState'
import {
  Heading,
  Radio,
  RadioGroup,
  ReadMore,
  TextField,
} from '@navikt/ds-react'
import React, { useContext } from 'react'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import FormWrapper from '../FormWrapper'
import stepStyles from '../styles/stepStyles.module.css'
import Substep from '../Substep'
import { logger } from '../utils/logging'

const UtlandsStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)
  const utlandRadio = React.useRef<HTMLFieldSetElement>(null)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('UtlandsStep')
    if (!hasErrors) {
      logger('button klikk', { tekst: 'Neste fra Utland' })
      formPageProps.goToNext()
      return true
    }
    return false
  }

  return (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <Heading level="2" size="medium" className={stepStyles.underOverskrift}>
          Opphold utenfor Norge
        </Heading>
        <div>
          <RadioGroup
            ref={utlandRadio}
            legend="Har du bodd eller jobbet utenfor Norge?"
            value={state.harBoddIUtland}
            onChange={(it: boolean) =>
              handleFieldChange((draft) => {
                if (it === false) {
                  draft.utenlandsAntallAar = undefined
                }
                draft.harBoddIUtland = it
              }, 'harBoddIUtland')
            }
            error={errorFields.harBoddIUtland}
          >
            <Radio
              data-has-error={errorFields.harBoddIUtland ? true : false}
              value={true}
            >
              Ja
            </Radio>
            <Radio value={false}>Nei</Radio>
          </RadioGroup>
          <ReadMore
            className={stepStyles.componentSpacing}
            header="Om opphold utenfor Norge"
          >
            Hvis du har bodd eller jobbet utenfor Norge, kan det påvirke
            pensjonen din. Hvis du har bodd i utlandet, kan du ha rett til
            pensjon fra det landet du har bodd i.
          </ReadMore>
          {state.harBoddIUtland && (
            <Substep>
              <TextField
                className={stepStyles.textfieldAar}
                onChange={(it) =>
                  handleFieldChange((draft) => {
                    const value = it.target.value
                    draft.utenlandsAntallAar =
                      value.length > 0 ? value : undefined
                  }, 'utenlandsAntallAar')
                }
                inputMode="numeric"
                label="Hvor mange år har du bodd eller jobbet utenfor Norge?"
                description="Fra du fylte 16 år til du tar ut pensjon"
                value={state.utenlandsAntallAar ?? ''}
                error={errorFields.utenlandsAntallAar}
              ></TextField>
            </Substep>
          )}
        </div>
        <FormButtons currentStepName="Opphold utenfor norge" />
      </FormWrapper>
    </>
  )
}

export default UtlandsStep
