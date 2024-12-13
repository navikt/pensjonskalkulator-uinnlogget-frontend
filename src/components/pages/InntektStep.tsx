import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import { useFieldChange } from '@/helpers/useFormState'
import {
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField,
} from '@navikt/ds-react'
import { useContext, useMemo } from 'react'
import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import FormWrapper from '../FormWrapper'
import '../styles/selectStyle.css'
import stepStyles from '../styles/stepStyles.module.css'
import Substep from '../Substep'
import { updateAndFormatInntektFromInputField } from './utils/inntekt'

const InntektStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  const onSubmit = () => {
    const hasErrors = validateFields('InntektStep')

    if (!hasErrors) {
      formPageProps.goToNext()
      return true
    }

    return false
  }

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => (
        <option value={i + 62} key={i}>
          {i + 62} år
        </option>
      )),
    []
  )

  return (
    <FormWrapper onSubmit={onSubmit}>
      <h2 className={stepStyles.underOverskrift}>Inntekt og alderspensjon</h2>
      <TextField
        value={state.aarligInntektFoerUttakBeloep ?? ''}
        className={stepStyles.textfieldInntekt}
        onChange={(it) =>
          handleFieldChange((draft) => {
            const value = it.target.value
            updateAndFormatInntektFromInputField(value, (formattedValue) => {
              draft.aarligInntektFoerUttakBeloep =
                formattedValue.length === 0 ? null : formattedValue
            })
          }, 'aarligInntektFoerUttakBeloep')
        }
        type="text"
        inputMode="numeric"
        label="Hva er din årlige pensjonsgivende inntekt frem til du tar ut pensjon?"
        description="Dagens kroneverdi før skatt"
        error={errorFields.aarligInntektFoerUttakBeloep}
      />
      <ReadMore header="Om pensjonsgivende inntekt">
        Inntekten vil bli brukt som inntekt alle år du har oppgitt å ha jobbet i
        Norge. Pensjonsgivende inntekt er arbeids- og næringsinntekt, honorarer
        og enkelte ytelser som du mottar i stedet for arbeidsinntekt.
      </ReadMore>

      <Substep>
        <Select
          value={
            state.gradertUttak === undefined
              ? '100'
              : state.gradertUttak && state.gradertUttak.grad
                ? state.gradertUttak.grad
                : ''
          }
          className="selectGrad"
          label={'Hvor mye alderspensjon vil du ta ut?'}
          description="Velg uttaksgrad"
          onChange={(it) => {
            handleFieldChange((draft) => {
              if (it.target.value === '') {
                draft.gradertUttak = {
                  grad: null,
                  uttaksalder: {
                    aar: null,
                    maaneder: null,
                  },
                }
              } else if (it.target.value === '100') {
                draft.gradertUttak = undefined
              } else {
                draft.gradertUttak = {
                  grad: parseInt(it.target.value),
                  uttaksalder: {
                    aar: null,
                    maaneder: null,
                  },
                }
              }
            }, 'uttaksgrad')
          }}
          error={errorFields.uttaksgrad}
        >
          <option value={''} key="empty">
            ----
          </option>
          <option value={'20'} key="20">
            20%
          </option>
          <option value={'40'} key="40">
            40%
          </option>
          <option value={'50'} key="50">
            50%
          </option>
          <option value={'60'} key="60">
            60%
          </option>
          <option value={'80'} key="80">
            80%
          </option>
          <option value={'100'} key="100">
            100%
          </option>
        </Select>
        <ReadMore header="Om uttaksgrad">
          Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å
          ta ut. Du kan velge gradert uttak (20, 40, 50, 60 eller 80 %), eller
          hel alderspensjon (100 %).
        </ReadMore>
      </Substep>
      {state.gradertUttak && state.gradertUttak?.grad && (
        <div>
          <Substep>
            <Select
              value={state.gradertUttak.uttaksalder.aar ?? ''}
              className="selectAar"
              label={`Hvilken alder planlegger du å ta ut ${state.gradertUttak.grad}% pensjon?`}
              data-testid="gradertUttaksalder"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  draft.gradertUttak!.uttaksalder.aar =
                    it.target.value === '' ? null : parseInt(it.target.value)
                  draft.gradertUttak!.uttaksalder.maaneder = 0
                }, 'gradertUttaksalder')
              }}
              error={errorFields.gradertUttaksalder}
            >
              <option value={''}>----</option>
              {yearOptions}
            </Select>
          </Substep>

          <Substep>
            <TextField
              onChange={(it) => {
                handleFieldChange((draft) => {
                  const value = it.target.value
                  updateAndFormatInntektFromInputField(
                    value,
                    (formattedValue) => {
                      draft.gradertUttak!.aarligInntektVsaPensjonBeloep =
                        formattedValue.length === 0 ? undefined : formattedValue
                    }
                  )
                }, 'gradertInntekt')
              }}
              type="text"
              inputMode="numeric"
              className={stepStyles.textfieldInntekt}
              label={`Hva forventer du å ha i årlig inntekt samtidig som du tar ${state.gradertUttak?.grad}% pensjon?`}
              error={errorFields.gradertInntekt}
              value={state.gradertUttak?.aarligInntektVsaPensjonBeloep ?? ''}
            />
          </Substep>
        </div>
      )}
      <Substep>
        <Select
          value={state.heltUttak.uttaksalder?.aar ?? ''}
          className="selectAar"
          data-testid="heltUttaksalder"
          label="Hvilken alder planlegger du å ta ut 100% pensjon?"
          onChange={(it) => {
            handleFieldChange((draft) => {
              draft.heltUttak.uttaksalder.aar =
                it.target.value === '' ? null : parseInt(it.target.value)
              draft.heltUttak.uttaksalder.maaneder = 0
            }, 'heltUttaksalder')
          }}
          error={errorFields.heltUttaksalder}
        >
          <option value={''}>----</option>
          {yearOptions}
        </Select>
      </Substep>
      <Substep>
        <RadioGroup
          legend="Forventer du å ha inntekt etter uttak av hel pensjon?"
          description="Du kan tjene så mye du vil samtidig som du tar ut pensjon."
          value={state.harInntektVsaHelPensjon}
          onChange={(it: boolean) =>
            handleFieldChange((draft) => {
              if (it === false) {
                draft.heltUttak.aarligInntektVsaPensjon = undefined
              }
              draft.harInntektVsaHelPensjon = it
            }, 'harInntektVsaHelPensjon')
          }
          error={errorFields.harInntektVsaHelPensjon}
        >
          <Radio
            data-has-error={errorFields.harInntektVsaHelPensjon ? true : false}
            value={true}
          >
            Ja
          </Radio>
          <Radio value={false}>Nei</Radio>
        </RadioGroup>
      </Substep>
      {state.harInntektVsaHelPensjon === true && (
        <>
          <Substep>
            <TextField
              label="Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?"
              className={stepStyles.textfieldInntekt}
              value={state.heltUttak.aarligInntektVsaPensjon?.beloep ?? ''}
              type="text"
              inputMode="numeric"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  const value = it.target.value
                  updateAndFormatInntektFromInputField(
                    value,
                    (formattedValue) => {
                      draft.heltUttak.aarligInntektVsaPensjon = {
                        ...draft.heltUttak.aarligInntektVsaPensjon,
                        beloep:
                          formattedValue.length === 0 ? null : formattedValue,
                      }
                    }
                  )
                }, 'helPensjonInntekt')
              }}
              error={errorFields.helPensjonInntekt}
            />
          </Substep>

          <Substep>
            <Select
              value={
                state.heltUttak.aarligInntektVsaPensjon?.sluttAlder ===
                undefined
                  ? 'livsvarig'
                  : state.heltUttak.aarligInntektVsaPensjon.sluttAlder &&
                      state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar
                    ? state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar
                    : ''
              }
              className="selectAar"
              data-testid="heltUttakSluttAlderAar"
              label="Til hvilken alder forventer du å ha inntekten?"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  if (
                    it.target.value === '' ||
                    !draft.heltUttak.aarligInntektVsaPensjon
                  ) {
                    draft.heltUttak.aarligInntektVsaPensjon = {
                      beloep:
                        draft.heltUttak.aarligInntektVsaPensjon?.beloep ?? null,
                      sluttAlder: {
                        aar: null,
                        maaneder: null,
                      },
                    }
                  } else if (it.target.value === 'livsvarig') {
                    draft.heltUttak.aarligInntektVsaPensjon.sluttAlder =
                      undefined
                  } else {
                    draft.heltUttak.aarligInntektVsaPensjon = {
                      beloep:
                        draft.heltUttak.aarligInntektVsaPensjon?.beloep ?? null,
                      sluttAlder: {
                        aar: parseInt(it.target.value),
                        maaneder: 0,
                      },
                    }
                  }
                }, 'heltUttakSluttAlderAar')
              }}
              error={errorFields.heltUttakSluttAlderAar}
            >
              <option value={''}>----</option>
              {yearOptions}
              <option value={'livsvarig'}>Livsvarig</option>
            </Select>
          </Substep>
        </>
      )}
      <FormButtons />
    </FormWrapper>
  )
}

export default InntektStep
