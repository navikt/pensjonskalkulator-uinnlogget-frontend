'use client'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import TestStep from '@/components/pages/TestStep'
import StepBox from '@/components/StepBox'
import useMultiStepForm from '@/helpers/useMultiStepForm'
import { Box, Button, FormProgress, HStack } from '@navikt/ds-react'
import Link from 'next/link'
import React from 'react'

function page() {
  const pages = [<AlderStep />, <TestStep />, <InntektStep />]

  const { curStep, step, next, back, goTo } = useMultiStepForm(pages)

  return (
    <Box padding={'8'} width={'full'} background='surface-subtle'>
      <div className='flex items-center w-full'>
        <div className='mx-auto'>
          <h2 className=' mb-3'>Pensjonskalkulator</h2>
          <Box
            marginBlock={'auto'}
            width={'fit-content'}
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
            </FormProgress>
            {step}
            <HStack gap={'2'}>
              {curStep !== pages.length ? (
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
      </div>
    </Box>
  )
}

export default page
