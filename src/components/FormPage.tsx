'use client'

import { State } from '@/common'
import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import { FormContext } from '@/contexts/context'
import useMultiStepForm from '@/helpers/useMultiStepForm'
import UtlandsStep from './pages/UtlandsStep'

import { initialState } from '@/defaults/initialState'
import { useEffect, useState } from 'react'
import FormContainerComponent from './FormContainer'
import BeregnPage from './pages/BeregnPage'
import SivilstandStep from './pages/SivilstandStep'

interface FormPageProps {
  grunnbelop?: number
}

interface Pages {
  [key: string]: JSX.Element
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [state, setState] = useState<State>(initialState)

  const pagesDict: Pages = {
    alder: <AlderStep key="alder" />,
    utland: <UtlandsStep key="utland" />,
    inntekt: <InntektStep key="inntekt" />,
    sivilstand: <SivilstandStep grunnbelop={grunnbelop} key="sivilstand" />,
    afp: <AFPStep key="afp" />,
  }

  const pageTitles = [
    'Alder og yrkesaktivitet',
    'Opphold utenfor Norge',
    'Inntekt og alderspensjon',
    'Sivilstand',
    'Avtalefestet pensjon (AFP)',
    'Beregning',
  ]
  const pagesNames = Object.keys(pagesDict)

  const lastPage = <BeregnPage key="beregn" />

  const { curStep, step, goToNext, goBack, goTo } = useMultiStepForm(
    pagesDict,
    lastPage
  )
  const length = pagesNames.length

  useEffect(() => {
    document.title = pageTitles[curStep] + ' – Uinnlogget pensjonskalkulator'
  }, [curStep])

  return (
    <FormContext.Provider
      value={{
        setState: setState,
        state: state,
        completedSteps: [],
        formPageProps: {
          curStep,
          length,
          goBack,
          goToNext,
          goTo,
        },
      }}
    >
      <>
        {curStep !== length ? (
          <FormContainerComponent
            totalSteps={length}
            activeStep={curStep}
            step={step}
          />
        ) : (
          <BeregnPage />
        )}
      </>
    </FormContext.Provider>
  )
}

export default FormPage
