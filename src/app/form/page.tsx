'use client'

import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import TestStep from '@/components/pages/TestStep'
import StepBox from '@/components/StepBox'
import useMultiStepForm from '@/helpers/useMultiStepForm'
import {
  Box,
  Button,
  FormProgress,
  HStack,
  ProgressBar
} from '@navikt/ds-react'
import Link from 'next/link'

export type Values = {
  [key: string]: { state: string }
}

export interface ContextForm {
  states: Values
  setState: Dispatch<React.SetStateAction<Values>>
}

import React, { createContext, Dispatch, SetStateAction, useState } from 'react'
export const FormContext = createContext<ContextForm | undefined>(undefined)

function page() {
  const [formState, setFormSate] = useState<Values>({})
  const pages = [<AlderStep />, <TestStep />, <InntektStep />, <AFPStep />]

  const { curStep, step, next, back, goTo } = useMultiStepForm(pages)

  return (
    <Box width={'full'} background='surface-subtle'>
      <div className='flex flex-col items-center w-full'>
        <h2 className=' mb-3'>Pensjonskalkulator</h2>

        <Box
          marginBlock={'auto'}
          width={'100%'}
          maxWidth={'40rem'}
          padding={'4'}
          background='bg-default'
        >
          <FormProgress
            totalSteps={pages.length}
            activeStep={curStep + 1}
            onStepChange={(newStep) => goTo(newStep - 1)}
          >
            <FormProgress.Step>Alder</FormProgress.Step>
            <FormProgress.Step>Test</FormProgress.Step>
            <FormProgress.Step>Inntekt</FormProgress.Step>
            <FormProgress.Step>AFP</FormProgress.Step>
          </FormProgress>
          {/* <ProgressBar
            value={curStep + 1}
            valueMax={pages.length}
            size='medium'
            aria-labelledby='progress-bar-label-medium'
          /> */}
          <FormContext.Provider
            value={{ setState: setFormSate, states: formState }}
          >
            {step}
          </FormContext.Provider>
          <HStack gap={'2'}>
            {curStep !== pages.length - 1 ? (
              <Button onClick={next} variant='primary'>
                Neste
              </Button>
            ) : (
              <Button onClick={next} variant='primary'>
                Send Inn
              </Button>
            )}
            {curStep !== 0 && (
              <Button onClick={back} variant='tertiary'>
                Forrige
              </Button>
            )}
          </HStack>
          <Link href='https://staging.ekstern.dev.nav.no/pensjon/kalkulator/start#:~:text=Personopplysninger%20som%20brukes%20i%20pensjonskalkulator'>
            Personopplysninger som brukes i pensjonskalkulator
          </Link>
        </Box>
      </div>
      {/* </div> */}
    </Box>
  )
}

export default page
