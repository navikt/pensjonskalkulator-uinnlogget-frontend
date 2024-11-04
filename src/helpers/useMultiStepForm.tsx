'use client'

import { useState } from 'react'

interface Pages {
  [key: string]: JSX.Element
}

function useMultiStepForm(steps: Pages, lastPage: JSX.Element) {
  const [curStep, setCurStep] = useState(0)
  const pages = Object.keys(steps)

  const goToNext = () => {
    setCurStep((prev) => {
      if (prev < pages.length) {
        return prev + 1
      }
      return prev
    })
  }

  const goBack = () => {
    setCurStep((prev) => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
  }

  const goTo = (step: number) => {
    if (step >= 0 && step <= pages.length) {
      setCurStep(step)
    }
  }

  return {
    curStep,
    step: curStep === pages.length ? lastPage : steps[pages[curStep]],
    goToNext,
    goBack,
    goTo,
    stepName: pages[curStep],
  }
}

export default useMultiStepForm
