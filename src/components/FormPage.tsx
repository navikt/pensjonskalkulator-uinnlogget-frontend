'use client'

import { State } from '@/common'
import AFPStep from '@/components/pages/AFPStep'
import AlderStep from '@/components/pages/AlderStep'
import InntektStep from '@/components/pages/InntektStep'
import UtlandsStep from './pages/UtlandsStep'
import { FormContext } from '@/contexts/context'
import useMultiStepForm from '@/helpers/useMultiStepForm'

import React, { useState } from 'react'
import EktefelleStep from './pages/EktefelleStep'
import FormContainerComponent from './FormContainerComponent'
import BeregnPage from './pages/BeregnPage'
import { initialFormState } from '@/defaults/defaultFormState'

interface FormPageProps {
  grunnbelop?: number
}

interface Pages {
  [key: string]: JSX.Element
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [formState, setFormState] = useState<State>(initialFormState)

  const pagesDict: Pages = {
    alder: <AlderStep key="alder" />,
    utland: <UtlandsStep key="utland" />,
    inntekt: <InntektStep key="inntekt" />,
    ektefelle: <EktefelleStep grunnbelop={grunnbelop} key="ektefelle" />,
    afp: <AFPStep key="afp" />,
  }
  const pagesNames = Object.keys(pagesDict)

  const lastPage = <BeregnPage key="beregn" />

  const { curStep, step, goToNext, goBack } = useMultiStepForm(
    pagesDict,
    lastPage
  )
  const length = pagesNames.length

  return (
    <FormContext.Provider
      value={{
        setState: setFormState,
        state: formState,
        formPageProps: {
          curStep,
          length,
          goBack,
          goToNext,
        },
      }}
    >
      <>
        {curStep !== length ? (
          <FormContainerComponent
            totalSteps={length}
            activeStep={curStep + 1}
            goBack={goBack}
            step={step}
            curStep={curStep}
            length={length}
          />
        ) : (
          <BeregnPage />
        )}
      </>
    </FormContext.Provider>
  )
}

export default FormPage
