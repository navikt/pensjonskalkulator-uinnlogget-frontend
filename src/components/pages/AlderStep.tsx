import React, {
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState
} from 'react'
import StepBox from '../StepBox'
import {
  Bleed,
  BodyShort,
  Box,
  Heading,
  TextField,
  VStack
} from '@navikt/ds-react'
import FormWrapper from '../FormWrapper'

import { ContextForm, FormValues, StepRef } from '@/common'
import { FormContext } from '@/contexts/context'

const AlderStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errorMsgTaut, setErrorMsgTaut] = useState<string | null>(null)
  const message = 'Du må oppgi et gyldig årstall'

  const { alder, aarYrkesaktiv } = states

  useImperativeHandle(ref, () => ({
    onSubmit() {
      var willContinue = true

      if (
        !alder ||
        parseInt(alder) < 1900 ||
        parseInt(alder) > new Date().getFullYear()
      ) {
        setErrorMsg(message)
        willContinue = false
      } else {
        setErrorMsg(null)
      }

      if (!aarYrkesaktiv || parseInt(aarYrkesaktiv) < 0 || parseInt(aarYrkesaktiv) > 10) {
        setErrorMsgTaut(
          'Du maksimalt være 10 år yrkesaktiv etter at du har tatt ut pensjon'
        )
        willContinue = false
      } else {
        setErrorMsgTaut(null)
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
                alder: it.target.value
              }))
            }
            type='number'
            label='I hvilket år er du født?'
            value={alder}
            error={errorMsg}
          ></TextField>
        </Box>
        <Box
          marginBlock='1 2'
          borderWidth='0 0 1 0'
          borderColor='border-subtle'
        />
        <Bleed marginBlock={'2'}>
          <Heading size='xsmall'>
            Hvor mange år vil du være yrkesaktiv fram til du tar ut pensjon?
          </Heading>
        </Bleed>
        <Box maxWidth={{ md: '30%', sm: '8rem' }}>
          <TextField
            maxLength={3}
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                aarYrkesaktiv: it.target.value
              }))
            }
            type='number'
            label='Skriv antall år'
            value={aarYrkesaktiv}
            error={errorMsgTaut}
          ></TextField>
        </Box>
      </FormWrapper>
    </>
  )
})

AlderStep.displayName = 'AlderStep'
export default AlderStep
