import React, {
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import {
  Bleed,
  BodyShort,
  Box,
  Heading,
  TextField,
} from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'
import { ContextForm, FormValues, StepRef } from '@/common'
import { FormContext } from '@/contexts/context'
import useErrorHandling from './useErrorHandling'

const AlderStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorFields, { validateFields, clearError }] = useErrorHandling(states)

  const handleFieldChange = (field: keyof FormValues, value: number | null) => {
    setState((prev: FormValues) => ({
      ...prev,
      [field]: value,
    }));
    clearError(field);
  }

  useImperativeHandle(ref, () => ({
    onSubmit() {
      const hasErrors = validateFields("AlderStep");
      if(!hasErrors) return true;  
      return false;
    }
  }))

  return (
    <>
      <FormWrapper>
        {/* <Heading level='1' size='medium'>
          Hvilket år er du født?
        </Heading> */}
        <Box maxWidth={{ md: '30%', sm: '8rem' }}>
          <TextField
            maxLength={3}
            onChange={(it) => handleFieldChange('foedselAar', it.target.value === '' ? 0 : parseInt(it.target.value, 10))}
            type='number'
            inputMode='numeric'
            label='I hvilket år er du født?'
            value={states.foedselAar === 0 ? "" : states.foedselAar}
            error={errorFields.foedselAar}
          ></TextField>
        </Box>
        <Box
          marginBlock='1 2'
          borderWidth='0 0 1 0'
          borderColor='border-subtle'
        />
        {/* <Bleed marginBlock={'2'}>
          <Heading size='xsmall'>
            Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?
          </Heading>
        </Bleed> */}
        <Box maxWidth={{ md: '30%', sm: '8rem' }}>
          <TextField
            maxLength={3}
            onChange={(it) => handleFieldChange('inntektOver1GAntallAar', it.target.value === '' ? 0 : parseInt(it.target.value, 10))}
            type='number'
            inputMode='numeric'
            label='Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
            value={states.inntektOver1GAntallAar === 0 ? "" : states.inntektOver1GAntallAar}
            error={errorFields.inntektOver1GAntallAar}
          ></TextField>
        </Box>
      </FormWrapper>
    </>
  )
})

AlderStep.displayName = 'AlderStep'
export default AlderStep
