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
import { initialState } from '@/defaults/defaultFormState'

interface FormPageProps {
  grunnbelop?: number
}

interface Pages {
  [key: string]: JSX.Element
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [formState, setFormState] = useState<State>(initialState)

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
