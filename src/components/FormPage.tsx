'use client'

import { FormValueResult, FormValues, StepRef } from '@/common'
import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import UtlandsStep from './pages/UtlandsStep'
import { FormContext } from '@/contexts/context'
import useMultiStepForm from '@/helpers/useMultiStepForm'

import React, { FormEvent, useRef, useState } from 'react'
import EktefelleStep from './pages/EktefelleStep'
import { useRouter } from 'next/navigation'
import submitForm from '@/functions/submitForm'
import Beregn from './pages/Beregn'
import LoadingComponent from './LoadingComponent'
import FormContainerComponent from './FormContainerComponent'

const initialFormState: FormValues = {
  simuleringType: undefined,
  foedselAar: 0,
  sivilstand: 'UGIFT',
  epsHarInntektOver2G: undefined,
  epsHarPensjon: undefined,
  boddIUtland: '', // fjernes fra ApiPayloaded
  inntektVsaHelPensjon: '', // fjernes fra ApiPayloaded
  utenlandsAntallAar: 0,
  inntektOver1GAntallAar: 0, //Spør espen om dette. Hva er denne verdien og hvilket intervall kan den være mellom. Fiks useErrorHandling.ts i henhold til dette.
  aarligInntektFoerUttakBeloep: 0,
  gradertUttak: {
    grad: 0,
    uttakAlder: {
      aar: 0,
      maaneder: -1,
    },
    aarligInntektVsaPensjonBeloep: 0,
  },
  heltUttak: {
    uttakAlder: {
      aar: 0,
      maaneder: -1,
    },
    aarligInntektVsaPensjon: {
      beloep: 0,
      sluttAlder: {
        aar: 0,
        maaneder: -1,
      },
    },
  },
}

interface FormPageProps {
  grunnbelop: number
}

interface Pages {
  [key: string]: JSX.Element
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [formState, setFormState] = useState<FormValues>(initialFormState)
  const [failedToSubmit, setFailedToSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [beregnResult, setBeregnResult] = useState<FormValueResult>()
  const [showBeregnPage, setShowBeregnPage] = useState(false)
  const childRef = useRef<StepRef>(null) // Ref to access child component method
  const router = useRouter()

  const pagesDict: Pages = {
    alder: <AlderStep key="alder" />,
    utland: <UtlandsStep key="utland" />,
    inntekt: <InntektStep key="inntekt" />,
    ektefelle: <EktefelleStep grunnbelop={grunnbelop} key="ektefelle" />,
    afp: <AFPStep grunnbelop={grunnbelop} key="afp" />,
  }
  const pagesNames = Object.keys(pagesDict)

  const { curStep, step, next, back, goTo } = useMultiStepForm(
    pagesDict,
    (e: number) => {
      // history.pushState({ page: curStep }, '', `${pagesNames[e]}`)
    }
  )
  const length = pagesNames.length

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (curStep === length - 1) {
      setLoading(true)
      try {
        const resultData = await submitForm(formState)
        setBeregnResult(JSON.parse(resultData))
        console.log(resultData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
        setShowBeregnPage(true)
      }
    }
    if (childRef.current?.onSubmit()) {
      next()
    }
  }

  return (
    <FormContext.Provider value={{ setState: setFormState, states: formState }}>
      {showBeregnPage && beregnResult ? (
        <Beregn beregnResult={beregnResult} />
      ) : (
        <>
          {loading ? (
            <LoadingComponent />
          ) : (
            <FormContainerComponent
              totalSteps={length}
              activeStep={curStep + 1}
              back={back}
              onStepChange={(i) => goTo(i)}
              handleSubmit={handleSubmit}
              step={step}
              childRef={childRef}
              curStep={curStep}
              length={length}
            />
          )}
        </>
      )}
    </FormContext.Provider>
  )
}

export default FormPage
