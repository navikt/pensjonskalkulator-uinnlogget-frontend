'use client'
import { useState } from 'react'

interface Pages {
  [key: string]: JSX.Element
}

function useMultiStepForm(steps: Pages, lastPage: JSX.Element) {
  const [curStep, setCurStep] = useState(0)
  const pages = Object.keys(steps)

  const next = () => {
    setCurStep((prev) => {
      prev = prev + 1
      console.log(prev)

      return prev
    })
  }

  const back = () => {
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
    next,
    back,
    goTo,
    stepName: pages[curStep],
  }
}

export default useMultiStepForm
