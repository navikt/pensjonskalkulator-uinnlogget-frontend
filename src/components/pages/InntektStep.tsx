import React, { useContext, useState } from 'react'
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

const InntektStep = () => {
  const { state, setState, formPageProps } = useContext(FormContext)
  const [livsvarigInntekt, setLivsvarigInntekt] = useState(true)
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

  return (
    <FormWrapper onSubmit={onSubmit}>
      <h2>Inntekt og alderspensjon</h2>
      <div className="w-30">
        <TextField
          onChange={(it) =>
            handleFieldChange((draft) => {
              draft.aarligInntektFoerUttakBeloep =
                it.target.value === '' ? 0 : parseInt(it.target.value, 10)
            }, 'aarligInntektFoerUttakBeloep')
          }
          type="number"
          inputMode="numeric"
          label="Hva er din forventede årlige inntekt?"
          description="Dagens kroneverdi før skatt"
          value={
            state.aarligInntektFoerUttakBeloep === 0
              ? ''
              : state.aarligInntektFoerUttakBeloep
          }
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
            value={state.gradertUttak?.grad}
            style={{ width: '5rem' }}
            label={'Hvilken uttaksgrad ønsker du?'}
            onChange={(it) => {
              handleFieldChange((draft) => {
                draft.gradertUttak!.grad = parseInt(it.target.value)
              }, 'uttaksgrad')
            }}
            error={errorFields.uttaksgrad}
          >
            <option value={'0'}>----</option>
            <option value={'20'}>20%</option>
            <option value={'40'}>40%</option>
            <option value={'50'}>50%</option>
            <option value={'60'}>60%</option>
            <option value={'80'}>80%</option>
            <option value={'100'}>100%</option>
          </Select>
        </Substep>
        {state.gradertUttak !== undefined &&
          state.gradertUttak?.grad !== 0 &&
          state.gradertUttak?.grad !== 100 && (
            <>
              <Substep>
                <div className="flex space-x-4">
                  <Select
                    value={state.gradertUttak?.uttakAlder.aar}
                    style={{ width: '5rem' }}
                    label={`Når planlegger du å ta ut ${state.gradertUttak?.grad}% pensjon?`}
                    description="Velg alder"
                    onChange={(it) => {
                      handleFieldChange((draft) => {
                        draft.gradertUttak!.uttakAlder.aar = parseInt(
                          it.target.value
                        )
                      }, 'gradertAar')
                    }}
                    error={errorFields.gradertAar}
                  >
                    <option value={0}>----</option>
                    {Array.from({ length: 14 }, (_, i) => (
                      <option value={i + 62} key={i}>
                        {i + 62} år
                      </option>
                    ))}
                  </Select>

                  <Select
                    value={state.gradertUttak?.uttakAlder.maaneder}
                    style={{ width: '5rem' }}
                    label={'-'}
                    description="Velg måned"
                    onChange={(it) => {
                      handleFieldChange((draft) => {
                        draft.gradertUttak!.uttakAlder.maaneder = parseInt(
                          it.target.value
                        )
                      }, 'gradertMaaneder')
                    }}
                    error={errorFields.gradertMaaneder}
                  >
                    <option value={-1}>----</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option value={i} key={i}>
                        {i + 1}.mnd
                      </option>
                    ))}
                  </Select>
                </div>
              </Substep>

              <Substep>
                <TextField
                  onChange={(it) => {
                    handleFieldChange((draft) => {
                      draft.gradertUttak!.aarligInntektVsaPensjonBeloep =
                        it.target.value === ''
                          ? 0
                          : parseInt(it.target.value, 10)
                    }, 'gradertInntekt')
                  }}
                  type="number"
                  inputMode="numeric"
                  style={{ width: '10rem' }}
                  label={`Hva forventer du å ha i årlig inntekt samtidig som du tar ${state.gradertUttak?.grad}% pensjon?`}
                  value={
                    state.gradertUttak?.aarligInntektVsaPensjonBeloep === 0
                      ? ''
                      : state.gradertUttak?.aarligInntektVsaPensjonBeloep
                  }
                  error={errorFields.gradertInntekt}
                />
              </Substep>
            </>
          )}
        <Substep>
          <div className="flex space-x-4">
            <Select
              value={state.heltUttak.uttakAlder.aar}
              style={{ width: '5rem' }}
              label={`Når planlegger du å ta ut 100% pensjon?`}
              description="Velg alder"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  draft.heltUttak.uttakAlder.aar = parseInt(it.target.value)
                }, 'heltUttakAar')
              }}
              error={errorFields.heltUttakAar}
            >
              <option value={0}>----</option>
              {Array.from({ length: 14 }, (_, i) => (
                <option value={i + 62} key={i}>
                  {i + 62} år
                </option>
              ))}
            </Select>

            <Select
              value={state.heltUttak.uttakAlder.maaneder}
              style={{ width: '5rem' }}
              label={'-'}
              description="Velg måned"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  draft.heltUttak.uttakAlder.maaneder = parseInt(
                    it.target.value
                  )
                }, 'heltUttakMaaneder')
              }}
              error={errorFields.heltUttakMaaneder}
            >
              <option value={-1}>----</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option value={i} key={i}>
                  {i + 1}.mnd
                </option>
              ))}
            </Select>
          </div>
        </Substep>
        <Substep>
          <RadioGroup
            legend="Forventer du å ha inntekt etter uttak av hel pensjon?"
            value={state.inntektVsaHelPensjon}
            onChange={(it) =>
              handleFieldChange((draft) => {
                draft.inntektVsaHelPensjon = it
              }, 'inntektVsaHelPensjon')
            }
            error={errorFields.inntektVsaHelPensjon}
          >
            <Radio value={'ja'}>Ja</Radio>
            <Radio value={'nei'}>Nei</Radio>
          </RadioGroup>
        </Substep>
        {state.inntektVsaHelPensjon === 'ja' && (
          <>
            <Substep>
              <TextField
                label="Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?"
                value={
                  state.heltUttak.aarligInntektVsaPensjon?.beloep === 0
                    ? ''
                    : state.heltUttak.aarligInntektVsaPensjon?.beloep
                }
                type="number"
                inputMode="numeric"
                onChange={(it) => {
                  handleFieldChange((draft) => {
                    draft.heltUttak.aarligInntektVsaPensjon!.beloep =
                      it.target.value === '' ? 0 : parseInt(it.target.value, 10)
                  }, 'helPensjonInntekt')
                }}
                error={errorFields.helPensjonInntekt}
              />
            </Substep>

            <Substep>
              <div className="flex space-x-4">
                <Select
                  value={
                    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar ??
                    'livsvarig'
                  }
                  style={{ width: '5rem' }}
                  label={'Til hvilken alder forventer du å ha inntekten?'}
                  description="Velg alder"
                  onChange={(it) => {
                    const value = it.target.value
                    setLivsvarigInntekt(value === 'livsvarig' ? true : false)
                    handleFieldChange((draft) => {
                      draft.heltUttak.aarligInntektVsaPensjon!.sluttAlder!.aar =
                        value === 'livsvarig' ? 0 : parseInt(value)
                    }, 'heltUttakAar')
                  }}
                >
                  <option value={'livsvarig'}>Livsvarig</option>
                  {Array.from({ length: 14 }, (_, i) => (
                    <option value={i + 62} key={i}>
                      {i + 62} år
                    </option>
                  ))}
                </Select>
                {!livsvarigInntekt && (
                  <Select
                    value={
                      state.heltUttak.aarligInntektVsaPensjon?.sluttAlder
                        ?.maaneder ?? -1
                    }
                    style={{ width: '5rem' }}
                    label={'Velg måned'}
                    onChange={(it) => {
                      const value = it.target.value
                      handleFieldChange((draft) => {
                        draft.heltUttak.aarligInntektVsaPensjon!.sluttAlder!.maaneder =
                          parseInt(value)
                      }, 'heltUttakSluttAlderMaaneder')
                    }}
                    error={errorFields.heltUttakSluttAlderMaaneder}
                  >
                    <option value={-1}>----</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option value={i} key={i}>
                        {i + 1}.mnd
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            </Substep>
          </>
        )}
      </div>
      <FormButtons />
    </FormWrapper>
  )
}

export default InntektStep
