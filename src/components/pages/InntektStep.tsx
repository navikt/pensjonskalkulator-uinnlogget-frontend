import React, { useContext, useMemo } from 'react'
import FormWrapper from '../FormWrapper'
import {
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField,
} from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { State } from '@/common'
import useErrorHandling from '../../helpers/useErrorHandling'
import Substep from '../Substep'
import FormButtons from '../FormButtons'
import { useFieldChange } from '@/helpers/useFormState'
import stepStyles from '../styles/stepStyles.module.css'
import '../styles/selectStyle.css'

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

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => (
        <option value={i} key={i}>
          {i} måneder
        </option>
      )),
    []
  )

  return (
    <FormWrapper onSubmit={onSubmit}>
      <h2>Inntekt og alderspensjon</h2>
      <div className="w-30">
        <TextField
          value={state.aarligInntektFoerUttakBeloep ?? ''}
          className={stepStyles.textfieldInntekt}
          onChange={(it) =>
            handleFieldChange((draft) => {
              const valueAsNumber = parseInt(it.target.value)
              draft.aarligInntektFoerUttakBeloep = isNaN(valueAsNumber)
                ? undefined
                : valueAsNumber
            }, 'aarligInntektFoerUttakBeloep')
          }
          type="text"
          inputMode="numeric"
          label="Hva er din forventede årlige inntekt?"
          description="Dagens kroneverdi før skatt"
          error={errorFields.aarligInntektFoerUttakBeloep}
        />
        <ReadMore header="Om pensjonsgivende inntekt">
          Dette regnes som pensjonsgivende inntekt: all lønnsinntekt for
          lønnstakere personinntekt fra næring for selvstendige foreldrepenger
          sykepenger dagpenger arbeidsavklaringspenger omstillingsstønad
          omsorgsstønad fosterhjemsgodtgjørelse (den delen som utgjør
          arbeidsgodtgjørelse) førstegangstjeneste (hvis påbegynt tidligst i
          2010) Pensjonsgivende inntekt har betydning for retten til og
          størrelsen på alderspensjon og andre pensjonsytelser. Den
          pensjonsgivende inntekten beregnes av Skatteetaten. Uføretrygd regnes
          ikke som pensjonsgivende inntekt. Uføretrygd gir opptjening til
          alderspensjon basert på antatt inntekt til og med året du fyller 61
          år.
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
                    uttakAlder: {
                      aar: null,
                      maaneder: null,
                    },
                  }
                } else if (it.target.value === '100') {
                  draft.gradertUttak = undefined
                } else {
                  draft.gradertUttak = {
                    grad: parseInt(it.target.value),
                    uttakAlder: {
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
        </Substep>
        {state.gradertUttak && state.gradertUttak?.grad && (
          <div>
            <Substep>
              <fieldset className={stepStyles.selectWrapper}>
                <legend>
                  <b>{`Når planlegger du å ta ut ${state.gradertUttak.grad}% pensjon?`}</b>
                </legend>
                <Select
                  value={state.gradertUttak.uttakAlder.aar ?? ''}
                  className="selectAar"
                  label="Velg alder"
                  data-testid="gradertAar"
                  onChange={(it) => {
                    handleFieldChange((draft) => {
                      draft.gradertUttak!.uttakAlder.aar =
                        it.target.value === ''
                          ? null
                          : parseInt(it.target.value)
                    }, 'gradertAar')
                  }}
                  error={errorFields.gradertAar}
                >
                  <option value={''}>----</option>
                  {yearOptions}
                </Select>

                <Select
                  value={state.gradertUttak.uttakAlder.maaneder ?? ''}
                  className="selectMaaneder"
                  data-testid="gradertMaaneder"
                  label="Velg måned"
                  onChange={(it) => {
                    handleFieldChange((draft) => {
                      draft.gradertUttak!.uttakAlder.maaneder =
                        it.target.value === ''
                          ? null
                          : parseInt(it.target.value)
                    }, 'gradertMaaneder')
                  }}
                  error={errorFields.gradertMaaneder}
                >
                  <option value={''}>----</option>
                  {monthOptions}
                </Select>
              </fieldset>
            </Substep>

            <Substep>
              <TextField
                onChange={(it) => {
                  handleFieldChange((draft) => {
                    const valueAsNumber = parseInt(it.target.value)
                    draft.gradertUttak!.aarligInntektVsaPensjonBeloep = isNaN(
                      valueAsNumber
                    )
                      ? undefined
                      : valueAsNumber
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
          <fieldset className={stepStyles.selectWrapper}>
            <legend>
              <b>Når planlegger du å ta ut 100% pensjon?</b>
            </legend>
            <Select
              value={state.heltUttak.uttakAlder?.aar ?? ''}
              className="selectAar"
              data-testid="heltUttakAar"
              label="Velg alder"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  draft.heltUttak.uttakAlder.aar =
                    it.target.value === '' ? null : parseInt(it.target.value)
                }, 'heltUttakAar')
              }}
              error={errorFields.heltUttakAar}
            >
              <option value={''}>----</option>
              {yearOptions}
            </Select>

            <Select
              value={state.heltUttak.uttakAlder?.maaneder ?? ''}
              className="selectMaaneder"
              data-testid="heltUttakMaaneder"
              label="Velg måned"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  draft.heltUttak.uttakAlder.maaneder =
                    it.target.value === '' ? null : parseInt(it.target.value)
                }, 'heltUttakMaaneder')
              }}
              error={errorFields.heltUttakMaaneder}
            >
              <option value={''}>----</option>
              {monthOptions}
            </Select>
          </fieldset>
        </Substep>
        <Substep>
          <RadioGroup
            legend="Forventer du å ha inntekt etter uttak av hel pensjon?"
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
            <Radio value={true}>Ja</Radio>
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
                    const valueAsNumber = parseInt(it.target.value)
                    draft.heltUttak.aarligInntektVsaPensjon = {
                      ...draft.heltUttak.aarligInntektVsaPensjon,
                      beloep: isNaN(valueAsNumber) ? null : valueAsNumber,
                    }
                  }, 'helPensjonInntekt')
                }}
                error={errorFields.helPensjonInntekt}
              />
            </Substep>

            <Substep>
              <fieldset className={stepStyles.selectWrapper}>
                <legend>
                  <b>Til hvilken alder forventer du å ha inntekten?</b>
                </legend>
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
                  label="Velg alder"
                  onChange={(it) => {
                    handleFieldChange((draft) => {
                      if (
                        it.target.value === '' ||
                        !draft.heltUttak.aarligInntektVsaPensjon
                      ) {
                        draft.heltUttak.aarligInntektVsaPensjon = {
                          beloep:
                            draft.heltUttak.aarligInntektVsaPensjon?.beloep ??
                            null,
                          sluttAlder: {
                            aar: null,
                            maaneder:
                              draft.heltUttak.aarligInntektVsaPensjon
                                ?.sluttAlder?.maaneder ?? null,
                          },
                        }
                      } else if (it.target.value === 'livsvarig') {
                        draft.heltUttak.aarligInntektVsaPensjon.sluttAlder =
                          undefined
                      } else {
                        draft.heltUttak.aarligInntektVsaPensjon = {
                          beloep:
                            draft.heltUttak.aarligInntektVsaPensjon?.beloep ??
                            null,
                          sluttAlder: {
                            aar: parseInt(it.target.value),
                            maaneder: null,
                          },
                        }
                      }
                    }, 'heltUttakSluttAlderAar')
                  }}
                  error={errorFields.heltUttakSluttAlderAar}
                >
                  <option value={''}>----</option>
                  <option value={'livsvarig'}>Livsvarig</option>
                  {yearOptions}
                </Select>
                {state.heltUttak.aarligInntektVsaPensjon?.sluttAlder && (
                  <Select
                    value={
                      state.heltUttak.aarligInntektVsaPensjon?.sluttAlder
                        ?.maaneder ?? ''
                    }
                    className="selectMaaneder"
                    data-testid="heltUttakSluttAlderMaaneder"
                    label={'Velg måned'}
                    onChange={(it) => {
                      const value = it.target.value
                      handleFieldChange((draft) => {
                        draft.heltUttak.aarligInntektVsaPensjon = {
                          beloep:
                            draft.heltUttak.aarligInntektVsaPensjon?.beloep ??
                            null,
                          sluttAlder: {
                            aar:
                              draft.heltUttak.aarligInntektVsaPensjon
                                ?.sluttAlder?.aar ?? null,
                            maaneder: value === '' ? null : parseInt(value),
                          },
                        }
                      }, 'heltUttakSluttAlderMaaneder')
                    }}
                    error={errorFields.heltUttakSluttAlderMaaneder}
                  >
                    <option value={''}>----</option>
                    {monthOptions}
                  </Select>
                )}
              </fieldset>
            </Substep>
          </>
        )}
      </div>
      <FormButtons />
    </FormWrapper>
  )
}

export default InntektStep
