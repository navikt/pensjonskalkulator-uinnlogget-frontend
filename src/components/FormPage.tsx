'use client'

import { ContextForm, FormValues, StepRef } from '@/common'
import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import UtlandsStep from './pages/UtlandsStep'
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

import React, {
  cloneElement,
  FormEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import EktefelleStep from './pages/EktefelleStep'
import { useRouter } from 'next/navigation'
import { on } from 'events'
/*
simuleringType - kan være “ALDERSPENSJON” eller “ALDERSPENSJON_MED_AFP_PRIVAT” (det velges av brukeren).
sivilstand - kan være “UGIFT”, “GIFT” eller “SAMBOER”.
epsHarInntektOver2G - ektefelle/partner/samboer har inntekt på mer enn 2 ganger folketrygdens grunnbeløp (G).
epsHarPensjon - ektefelle/partner/samboer har startet uttak av pensjon.
gradertUttak - brukes bare om brukeren tar ut mindre enn 100 % pensjon (vil være null ellers).
heltUttak - brukes alltid. Det er når brukeren starter uttak av 100 % pensjon.
uttakAlder - er brukerens alder når uttaket startes. Alder angis i antall fylte år og antall fylte måneder (0–11).
aarligInntektVsaPensjonBeloep - er brukerens årlige inntekt ved siden av (Vsa) pensjon. Det er et kronebeløp.
sluttAlder - er brukerens alder (år og måneder) når inntekten slutter. */

const initialFormState: FormValues = {
  simuleringType: '',
  foedselAar: 0,
  sivilstand: 'UGIFT',
  epsHarInntektOver2G: null,
  epsHarPensjon: null,
  boddIUtland: '', // fjernes fra ApiPayloaded
  inntektVsaHelPensjon: '', // fjernes fra ApiPayloaded
  utenlandsAntallAar: 0,
  inntektOver1GAntallAar: 0,
  aarligInntektFoerUttakBeloep: 0,
  gradertUttak: {
    grad: 0,
    uttakAlder: {
      aar: null,
      maaneder: null
    },
    aarligInntektVsaPensjonBeloep: 0
  },
  heltUttak: {
    uttakAlder: {
      aar: 0,
      maaneder: -1
    },
    aarligInntektVsaPensjon: {
      beloep: 0,
      sluttAlder: {
        aar: null,
        maaneder: null
      }
    }
  }
}

interface FormPageProps {
  grunnbelop: number
}

interface Pages {
  [key: string]: JSX.Element
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [formState, setFormSate] = useState<FormValues>(initialFormState)
  const childRef = useRef<StepRef>(null) // Ref to access child component method
  const router = useRouter()

  const pagesDict: Pages = {
    alder: <AlderStep key='alder' />,
    utland: <UtlandsStep key='utland' />,
    inntekt: <InntektStep key='inntekt' />,
    ektefelle: <EktefelleStep grunnbelop={grunnbelop} key='ektefelle' />,
    afp: <AFPStep grunnbelop={grunnbelop} key='afp' />
  }
  const pagesNames = Object.keys(pagesDict)

  const { curStep, step, next, back, goTo } = useMultiStepForm(pages)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (curStep == pages.length - 1) {
      // Remove specified fields from formState
      const { boddIUtland, inntektVsaHelPensjon, ...apiPayload } = formState
      console.log('Form submitted:', apiPayload)

      // Fetch CSRF token
      try {
        const csrfResponse = await fetch(
          'https://pensjonskalkulator-backend.intern.dev.nav.no/api/csrf'
        )

        if (!csrfResponse.ok) {
          throw new Error('Failed to fetch CSRF token')
        }

        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.token

        // Make POST request with CSRF token
        const response = await fetch(
          'https://pensjonskalkulator-backend.intern.dev.nav.no/api/v1/alderspensjon/anonym-simulering',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(apiPayload)
          }
        )

        if (!response.ok) {
          throw new Error('Failed to submit form')
        }

        const responseData = await response.json()
        console.log('Response:', responseData)
      } catch (error) {
        console.error('Error:', error)
      }

      return
    }
    if (childRef.current?.onSubmit()) {
      next()
    }
  }

  useEffect(() => {
    // Listen for the popstate event (triggered by back/forward navigation)
    const handlePopState = (event: any) => {
      // Retrieve state from event and update the pageState accordingly
      if (event.state) {
        goTo(event.state.page)
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleGoTo = (step: number) => {
    goTo(step)
    // router.push(`${stepName}`)
  }

  return (
    <Box padding={{ lg: '10', sm: '5' }} width={'full'} background='bg-default'>
      <Box
        maxWidth={'40rem'}
        width={'100%'}
        marginInline={'auto'}
        borderColor='border-default'
        // borderWidth='1'
        padding={'4'}
        borderRadius={'large'}
      >
        <div className='mb-3 text-left'>
          <h2>Pensjonskalkulator</h2>
        </div>
        <Box width={'100%'} padding={'4'} background='bg-default'>
          <FormProgress
            totalSteps={length}
            activeStep={curStep + 1}
            onStepChange={(newStep) => handleGoTo(newStep - 1)}
          >
            <FormProgress.Step>Alder</FormProgress.Step>
            <FormProgress.Step>Utland</FormProgress.Step>
            <FormProgress.Step>Inntekt</FormProgress.Step>
            <FormProgress.Step>Ektefelle</FormProgress.Step>
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
                {curStep === length - 1 ? 'Send' : 'Neste'}
              </Button>
              {curStep !== 0 && (
                <Button type='button' onClick={back} variant='tertiary'>
                  Forrige
                </Button>
              )}
            </HStack>
          </form>
        </Box>
      </Box>
      {/* </div> */}
    </Box>
  )
}

export default FormPage
