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
      prev = prev + 1
      console.log(prev)

      return prev
    })
  }

  const goBack = () => {
    setCurStep((prev) => {
      prev = prev - 1

      return prev
    })
  }

  const goTo = (step: number) => {
    setCurStep(step)
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
