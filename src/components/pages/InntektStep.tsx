import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import FormWrapper from '../FormWrapper'
import {
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField
} from '@navikt/ds-react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValues, StepRef } from '@/common'
import useErrorHandling from '../../helpers/useErrorHandling'
import Substep from '../Substep'

const InntektStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [livsvarigInntekt, setLivsvarigInntekt] = useState(true)
  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const updateNestedState = (state: FormValues, path: string, value: number | undefined): FormValues => {
    const keys = path.split('.');
    const lastKey = keys.pop() as string;
    const clone = { ...state };
  
    let nestedState: any = clone;
    keys.forEach(key => {
      if (!nestedState[key]) nestedState[key] = {};
      nestedState = nestedState[key];
    });
  
    nestedState[lastKey] = value;
    return clone;
  };

  const handleFieldChange = (field: string, value: number | undefined, error: string | null) => {
    setState((prev: FormValues) => updateNestedState(prev, field, value));
    clearError(error);
  }

  useImperativeHandle(ref, () => ({
    onSubmit() {

      const hasErrors = validateFields("InntektStep");

      if(!hasErrors){
        if (states.inntektVsaHelPensjon === 'nei') {
          if (states.heltUttak?.aarligInntektVsaPensjon){
            states.heltUttak.aarligInntektVsaPensjon.beloep = 0;
            states.heltUttak.aarligInntektVsaPensjon.sluttAlder = undefined;
          } 
        }
        if(livsvarigInntekt && states.heltUttak.aarligInntektVsaPensjon?.sluttAlder){
          states.heltUttak.aarligInntektVsaPensjon.sluttAlder = undefined;
        }
        if(states.gradertUttak?.grad === 100){
          states.gradertUttak = undefined;
        }

        return true
      }

      return false;
    }
  }))

  return (
    <FormWrapper>
      <h2>Inntekt og alderspensjon</h2>
      <div className='w-30'>
        <TextField
          onChange={(it) =>
            handleFieldChange('aarligInntektFoerUttakBeloep', it.target.value === '' ? 0 : parseInt(it.target.value, 10), 'aarligInntektFoerUttakBeloep')
          }
          type='number'
          inputMode='numeric'
          label='Hva er din forventede årlige inntekt?'
          description='Dagens kroneverdi før skatt'
          value={
            states.aarligInntektFoerUttakBeloep === 0
              ? ''
              : states.aarligInntektFoerUttakBeloep
          }
          error={errorFields.aarligInntektFoerUttakBeloep}
        />
        <ReadMore header='Om pensjonsgivende inntekt'>
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
            value={states.gradertUttak?.grad}
            style={{ width: '5rem' }}
            label={'Hvilken uttaksgrad ønsker du?'}
            onChange={(it) => {
              handleFieldChange('gradertUttak.grad', parseInt(it.target.value), 'uttaksgrad')
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
        {states.gradertUttak !== undefined && states.gradertUttak?.grad !== 0 && states.gradertUttak?.grad !== 100 && (
          <>
            <Substep>
              <div className='flex space-x-4'>
                <Select
                  value={states.gradertUttak?.uttakAlder.aar}
                  style={{ width: '5rem' }}
                  label={`Når planlegger du å ta ut ${states.gradertUttak?.grad}% pensjon?`}
                  description='Velg alder'
                  onChange={(it) => {
                    handleFieldChange('gradertUttak.uttakAlder.aar', parseInt(it.target.value), 'gradertAar')
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
                  value={states.gradertUttak?.uttakAlder.maaneder}
                  style={{ width: '5rem' }}
                  label={'-'}
                  description='Velg måned'
                  onChange={(it) => {
                    handleFieldChange('gradertUttak.uttakAlder.maaneder', parseInt(it.target.value), 'gradertMaaneder')
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
                  handleFieldChange('gradertUttak.aarligInntektVsaPensjonBeloep', it.target.value === '' ? 0 : parseInt(it.target.value, 10), 'gradertInntekt')
                }}
                type='number'
                inputMode='numeric'
                style={{ width: '10rem' }}
                label={`Hva forventer du å ha i årlig inntekt samtidig som du tar ${states.gradertUttak?.grad}% pensjon?`}
                value={
                  states.gradertUttak?.aarligInntektVsaPensjonBeloep === 0
                    ? ''
                    : states.gradertUttak?.aarligInntektVsaPensjonBeloep
                }
                error={errorFields.gradertInntekt}
              />
            </Substep>
          </>
        )}
        <Substep>
          <div className='flex space-x-4'>
            <Select
              value={states.heltUttak.uttakAlder.aar}
              style={{ width: '5rem' }}
              label={`Når planlegger du å ta ut 100% pensjon?`}
              description='Velg alder'
              onChange={(it) => {
                handleFieldChange('heltUttak.uttakAlder.aar', parseInt(it.target.value), 'heltUttakAar')
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
              value={states.heltUttak.uttakAlder.maaneder}
              style={{ width: '5rem' }}
              label={'-'}
              description='Velg måned'
              onChange={(it) => {
                handleFieldChange('heltUttak.uttakAlder.maaneder', parseInt(it.target.value), 'heltUttakMaaneder')
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
        <RadioGroup
          legend='Forventer du å ha inntekt etter uttak av hel pensjon?'
          value={states.inntektVsaHelPensjon}
          onChange={(it) =>
            handleFieldChange('inntektVsaHelPensjon', it, 'inntektVsaHelPensjon')
          }
          error={errorFields.inntektVsaHelPensjon}
        >
          <Radio value={'ja'}>Ja</Radio>
          <Radio value={'nei'}>Nei</Radio>
        </RadioGroup>
        {states.inntektVsaHelPensjon === 'ja' && (
          <>
            <Substep>
              <TextField
                label='Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
                value={
                  states.heltUttak.aarligInntektVsaPensjon?.beloep === 0
                    ? ''
                    : states.heltUttak.aarligInntektVsaPensjon?.beloep
                }
                type='number'
                inputMode='numeric'
                onChange={(it) => {
                  handleFieldChange('heltUttak.aarligInntektVsaPensjon.beloep', it.target.value === '' ? 0 : parseInt(it.target.value, 10), 'helPensjonInntekt')
                }}
                error={errorFields.helPensjonInntekt}
              />
            </Substep>

            <Substep>
              <div className='flex space-x-4'>
                <Select
                  value={
                    states.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar ??
                    'livsvarig'
                  }
                  style={{ width: '5rem' }}
                  label={'Til hvilken alder forventer du å ha inntekten?'}
                  description='Velg alder'
                  onChange={(it) => {
                    const value = it.target.value
                    setLivsvarigInntekt(value === 'livsvarig' ? true : false)
                    handleFieldChange('heltUttak.aarligInntektVsaPensjon.sluttAlder.aar', value === 'livsvarig' ? undefined : parseInt(value), 'heltUttakAar')
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
                      states.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.maaneder ?? 'livsvarig'
                    }
                    style={{ width: '5rem' }}
                    label={'Velg måned'}
                    onChange={(it) => {
                      const value = it.target.value
                      handleFieldChange('heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder', value === 'livsvarig' ? undefined : parseInt(value), 'helUttakMaaneder')
                    }}
                  >
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
    </FormWrapper>
  )
})

InntektStep.displayName = 'InntektStep'
export default InntektStep
