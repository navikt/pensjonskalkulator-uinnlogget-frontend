'use client'

import { StepRef, Values } from '@/common'
import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import StepBox from '@/components/StepBox'
import { FormContext } from '@/contexts/context'
import useMultiStepForm from '@/helpers/useMultiStepForm'
import {
  Box,
  Button,
  FormProgress,
  HStack,
  ProgressBar
} from '@navikt/ds-react'
import Link from 'next/link'

import React, { cloneElement, FormEvent, useRef, useState } from 'react'

function FormPage() {
  const [formState, setFormSate] = useState<Values>({})
  const childRef = useRef<StepRef>(null) // Ref to access child component method

  const pages = [
    <AlderStep key='alder' />,
    <InntektStep key='inntekt' />,
    <AFPStep key='afp' />
  ]

  const { curStep, step, next, back, goTo } = useMultiStepForm(pages)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (childRef.current?.onSubmit()) next()
  }

  return (
    <Box
      padding={{ lg: '10', sm: '0' }}
      width={'full'}
      background='surface-subtle'
    >
      <Box maxWidth={'40rem'} width={'100%'} marginInline={'auto'}>
        <div className='mb-3 text-left'>
          <h2>Pensjonskalkulator</h2>
        </div>
        <Box width={'100%'} padding={'4'} background='bg-default'>
          <FormProgress
            totalSteps={pages.length}
            activeStep={curStep + 1}
            onStepChange={(newStep) => goTo(newStep - 1)}
          >
            <FormProgress.Step>Alder</FormProgress.Step>
            <FormProgress.Step>Inntekt</FormProgress.Step>
            <FormProgress.Step>AFP</FormProgress.Step>
          </FormProgress>
          <form onSubmit={handleSubmit}>
            <FormContext.Provider
              value={{ setState: setFormSate, states: formState }}
            >
              {cloneElement(step, { ref: childRef })}
            </FormContext.Provider>
            <HStack gap={'2'} marginBlock='2'>
              <Button type='submit' variant='primary'>
                {curStep === pages.length - 1 ? 'Send Inn' : 'Neste'}
              </Button>
              {curStep !== 0 && (
                <Button type='button' onClick={back} variant='tertiary'>
                  Forrige
                </Button>
              )}
            </HStack>
          </form>
          <div className='mt-6'>
            <Link href='https://staging.ekstern.dev.nav.no/pensjon/kalkulator/start#:~:text=Personopplysninger%20som%20brukes%20i%20pensjonskalkulator'>
              Personopplysninger som brukes i pensjonskalkulator
            </Link>
          </div>
        </Box>
      </Box>
      {/* </div> */}
    </Box>
  )
}

export default FormPage
