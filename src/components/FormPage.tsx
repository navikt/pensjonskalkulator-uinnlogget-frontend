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
  grunnbelop: number
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

  const { curStep, step, goToNext, goBack, goTo } = useMultiStepForm(
    pagesDict,
    lastPage
  )
  const length = pagesNames.length

  const handleSubmit = async () => {
    // if (curStep === length - 1) {
    //   setLoading(true)
    //   try {
    //     const resultData = await submitForm(formState)
    //     setBeregnResult(JSON.parse(resultData))
    //     console.log(resultData)
    //   } catch (error) {
    //     console.error(error)
    //   } finally {
    //     setLoading(false)
    //     setShowBeregnPage(true)
    //   }
    // }
  }

  return (
    <FormContext.Provider
      value={{
        setState: setFormState,
        state: formState,
        formPageProps: {
          curStep,
          length,
          goBack,
          onStepChange: goTo,
          handleSubmit,
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
            onStepChange={(i) => goTo(i)}
            handleSubmit={handleSubmit}
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
