import { Suspense, useContext, useEffect, useMemo } from 'react'

import {
  Heading,
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField,
} from '@navikt/ds-react'

import useErrorHandling from '../../helpers/useErrorHandling'
import FormButtons from '../FormButtons'
import FormWrapper from '../FormWrapper'
import LoadingComponent from '../LoadingComponent'
import Substep from '../Substep'
import { logger } from '../utils/logging'
import { formatAndUpdateBeloep } from './utils/inntekt'
import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import { getAldersgrense } from '@/functions/aldersgrense'
import { useFieldChange } from '@/helpers/useFormState'

import '../styles/selectStyle.css'
import stepStyles from '../styles/stepStyles.module.css'

const InntektStepContent = () => {
  const yearsWithMonthOptionsIndex = [0, 5, 13]
  const totalYearArrayLength = 14

  const { state, setState, formPageProps } = useContext(FormContext)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(state)

  const { handleFieldChange } = useFieldChange<State>({
    setState,
    clearError,
  })

  useEffect(() => {
    document.title = 'Inntekt og alderspensjon - Uinnlogget pensjonskalkulator'
  }, [])

  useEffect(() => {
    const foedselAarNumber = state.foedselAar ? parseInt(state.foedselAar) : 0
    if (foedselAarNumber > 0) {
      getAldersgrense(foedselAarNumber).then((aldersgrense) => {
        if (aldersgrense) {
          handleFieldChange((draft) => {
            draft.aldersgrense = aldersgrense
          }, 'aldersgrense')
        }
      })
    }
  }, [state.foedselAar])

  const onSubmit = () => {
    const hasErrors = validateFields('InntektStep')

    if (!hasErrors) {
      logger('button klikk', { tekst: 'Neste fra Inntekt og alderspensjon' })
      formPageProps.goToNext()
      return true
    }

    return false
  }

  const aarArray = useMemo(() => {
    const nedreAldersgrense = state.aldersgrense.nedreAldersgrense
    const startAar = nedreAldersgrense?.aar
    const startMaaneder = nedreAldersgrense?.maaneder || 0

    if (!startAar) return []

    const result: { year: number; month: number }[] = []

    for (let index = 0; index < totalYearArrayLength; index++) {
      const year = startAar + index
      const showMonths =
        yearsWithMonthOptionsIndex.includes(index) && startMaaneder > 0

      if (index === 0 && startMaaneder > 0) {
        result.push({ year, month: startMaaneder })
      } else if (showMonths) {
        result.push({ year, month: 0 })
        result.push({ year, month: startMaaneder })
      } else {
        result.push({ year, month: 0 })
      }
    }

    return result
  }, [
    state.aldersgrense.nedreAldersgrense?.aar,
    state.aldersgrense.nedreAldersgrense?.maaneder,
  ])

  const yearOptions = useMemo(() => {
    if (!state.aldersgrense.nedreAldersgrense?.aar) {
      return []
    }

    return aarArray
      .map(({ year, month }) => {
        if (!year) return null

        const value = `${year}-${month}`
        const key = `${year}-${month}`

        return (
          <option value={value} key={key}>
            {month
              ? `${year} år og ${month === 1 ? '1 måned' : `${month} måneder`}`
              : `${year} år`}
          </option>
        )
      })
      .filter(Boolean)
  }, [aarArray])

  return (
    <FormWrapper onSubmit={onSubmit}>
      <Heading level="2" size="medium" className={stepStyles.underOverskrift}>
        Inntekt og alderspensjon
      </Heading>
      <TextField
        value={state.aarligInntektFoerUttakBeloep ?? ''}
        className={stepStyles.textfieldInntekt}
        onChange={(it) =>
          handleFieldChange((draft) => {
            const value = it.target.value
            formatAndUpdateBeloep(it, value, (formattedValue) => {
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
      <ReadMore
        header="Om pensjonsgivende inntekt"
        className={stepStyles.readMoreSpacing}
      >
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
          <option
            aria-label="Velg uttaksgrad"
            value={''}
            key="empty"
            disabled
          ></option>
          <option value={'20'} key="20">
            20&nbsp;%
          </option>
          <option value={'40'} key="40">
            40&nbsp;%
          </option>
          <option value={'50'} key="50">
            50&nbsp;%
          </option>
          <option value={'60'} key="60">
            60&nbsp;%
          </option>
          <option value={'80'} key="80">
            80&nbsp;%
          </option>
          <option value={'100'} key="100">
            100&nbsp;%
          </option>
        </Select>
        <ReadMore header="Om uttaksgrad" className={stepStyles.readMoreSpacing}>
          Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å
          ta ut. Du kan velge gradert uttak (20, 40, 50, 60 eller 80 %), eller
          hel alderspensjon (100&nbsp;%).
        </ReadMore>
      </Substep>
      {state.gradertUttak && state.gradertUttak?.grad && (
        <div>
          <Substep>
            <Select
              value={
                state.gradertUttak.uttaksalder.aar !== null
                  ? `${state.gradertUttak.uttaksalder.aar}-${state.gradertUttak.uttaksalder.maaneder ?? 0}`
                  : ''
              }
              className="selectAar"
              label={`Fra hvilken alder planlegger du å ta ut ${state.gradertUttak.grad} % pensjon?`}
              data-testid="gradertUttaksalder"
              onChange={(it) => {
                handleFieldChange((draft) => {
                  const selectedValue = it.target.value

                  if (!draft.gradertUttak) {
                    draft.gradertUttak = {
                      grad: null, // Or some default grad if appropriate
                      uttaksalder: { aar: null, maaneder: null },
                    }
                  }

                  if (selectedValue === '') {
                    draft.gradertUttak.uttaksalder.aar = null
                    draft.gradertUttak.uttaksalder.maaneder = null
                  } else {
                    const [yearStr, monthStr] = selectedValue.split('-')
                    const selectedYear = parseInt(yearStr)
                    const selectedMonth = parseInt(monthStr)

                    draft.gradertUttak!.uttaksalder.aar = selectedYear
                    draft.gradertUttak!.uttaksalder.maaneder = selectedMonth
                  }
                }, 'gradertUttaksalder')
              }}
              error={errorFields.gradertUttaksalder}
            >
              <option aria-label="Velg alder" value={''} disabled></option>
              {yearOptions}
            </Select>
          </Substep>

          <Substep>
            <TextField
              onChange={(it) => {
                handleFieldChange((draft) => {
                  const value = it.target.value
                  formatAndUpdateBeloep(it, value, (formattedValue) => {
                    draft.gradertUttak!.aarligInntektVsaPensjonBeloep =
                      formattedValue.length === 0 ? undefined : formattedValue
                  })
                }, 'gradertInntekt')
              }}
              type="text"
              inputMode="numeric"
              className={stepStyles.textfieldInntekt}
              label={`Hva forventer du å ha i årlig inntekt samtidig som du tar ${state.gradertUttak?.grad} % pensjon?`}
              description="Du kan tjene så mye du vil samtidig som du tar ut pensjon."
              error={errorFields.gradertInntekt}
              value={state.gradertUttak?.aarligInntektVsaPensjonBeloep ?? ''}
            />
          </Substep>
        </div>
      )}
      <Substep>
        <Select
          value={
            state.heltUttak.uttaksalder?.aar !== null
              ? `${state.heltUttak.uttaksalder.aar}-${state.heltUttak.uttaksalder.maaneder ?? 0}`
              : ''
          }
          className="selectAar"
          data-testid="heltUttaksalder"
          label="Fra hvilken alder planlegger du å ta ut 100&nbsp;% pensjon?"
          onChange={(it) => {
            handleFieldChange((draft) => {
              const selectedValue = it.target.value

              if (selectedValue === '') {
                draft.heltUttak.uttaksalder.aar = null
                draft.heltUttak.uttaksalder.maaneder = null
              } else {
                const [yearStr, monthStr] = selectedValue.split('-')
                const selectedYear = parseInt(yearStr)
                const selectedMonth = parseInt(monthStr)

                draft.heltUttak.uttaksalder.aar = selectedYear
                draft.heltUttak.uttaksalder.maaneder = selectedMonth
              }
            }, 'heltUttaksalder')
          }}
          error={errorFields.heltUttaksalder}
        >
          <option aria-label="Velg alder" value={''} disabled></option>
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
              } else {
                draft.heltUttak.aarligInntektVsaPensjon = {
                  beloep: null,
                  sluttAlder: {
                    aar: null,
                    maaneder: null,
                  },
                }
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
                  formatAndUpdateBeloep(it, value, (formattedValue) => {
                    draft.heltUttak.aarligInntektVsaPensjon = {
                      ...draft.heltUttak.aarligInntektVsaPensjon,
                      beloep:
                        formattedValue.length === 0 ? null : formattedValue,
                    }
                  })
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
                      state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar !==
                        null
                    ? `${state.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar}-${state.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder ?? 0}`
                    : ''
              }
              className="selectAar"
              data-testid="heltUttakSluttAlder"
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
                    const [yearStr, monthStr] = it.target.value.split('-')
                    const selectedYear = parseInt(yearStr)
                    const selectedMonth = parseInt(monthStr)

                    draft.heltUttak.aarligInntektVsaPensjon = {
                      beloep:
                        draft.heltUttak.aarligInntektVsaPensjon?.beloep ?? null,
                      sluttAlder: {
                        aar: selectedYear,
                        maaneder: selectedMonth,
                      },
                    }
                  }
                }, 'heltUttakSluttAlder')
              }}
              error={errorFields.heltUttakSluttAlder}
            >
              <option aria-label="Velg alder" value={''}></option>
              {yearOptions}
              <option value={'livsvarig'}>Livsvarig</option>
            </Select>
          </Substep>
        </>
      )}
      <FormButtons currentStepName="Inntekt og alderspensjon" />
    </FormWrapper>
  )
}

const InntektStep = () => (
  <Suspense fallback={<LoadingComponent />}>
    <InntektStepContent />
  </Suspense>
)

export default InntektStep
