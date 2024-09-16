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

const AlderStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errorMsgTaut, setErrorMsgTaut] = useState<string | null>(null)
  const [errorFields, setErrorFields] = React.useState({
    foedselAar: false,
    inntektOver1GAntallAar: false,
  });
  const message = 'Du må oppgi et gyldig årstall'

  const { foedselAar, inntektOver1GAntallAar } = states

  useImperativeHandle(ref, () => ({
    onSubmit() {
      var willContinue = true

      const errors = {
        foedselAar: !foedselAar,
        inntektOver1GAntallAar: !inntektOver1GAntallAar || inntektOver1GAntallAar < 0 || inntektOver1GAntallAar > 10,
      };

      setErrorFields(errors);

      if (Object.values(errors).some((error) => error)){
        
        if (
          !foedselAar ||
          foedselAar < 1900 ||
          foedselAar > new Date().getFullYear()
        ) {
          setErrorMsg(message)  
        }
  
        if (!inntektOver1GAntallAar) {
          setErrorMsgTaut(
            'Fyll ut antall år'
          )
        } 

        if(inntektOver1GAntallAar < 0){
          setErrorMsgTaut(
            'Oppgi positivt tall'
          )
        }

        if(inntektOver1GAntallAar > 10){
          setErrorMsgTaut(
            'Du maksimalt være 10 år yrkesaktiv etter at du har tatt ut pensjon'
          )
        }

        willContinue = false
      }


      return willContinue
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
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                foedselAar: it.target.value === "" ? 0: parseInt(it.target.value, 10)
              }))
            }
            type='number'
            inputMode='numeric'
            label='I hvilket år er du født?'
            value={foedselAar === 0 ? "" : foedselAar}
            error={errorFields.foedselAar ? errorMsg : ""}
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
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                inntektOver1GAntallAar: it.target.value === "" ? 0: parseInt(it.target.value, 10)
              }))
            }
            type='number'
            inputMode='numeric'
            label='Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?'
            value={inntektOver1GAntallAar === 0 ? "" : inntektOver1GAntallAar}
            error={errorFields.inntektOver1GAntallAar ? errorMsgTaut : ""}
          ></TextField>
        </Box>
      </FormWrapper>
    </>
  )
})

AlderStep.displayName = 'AlderStep'
export default AlderStep
