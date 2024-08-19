'use client'
import React, { ReactElement, useState } from 'react'

function useMultiStepForm(steps: ReactElement[]) {
  const [curStep, setCurStep] = useState(0)

  const next = () => {
    setCurStep((prev) => prev + 1)
  }

  const back = () => {
    setCurStep((prev) => prev - 1)
  }

  const goTo = (step: number) => {
    setCurStep(step)
  }

  return {
    curStep,
    step: steps[curStep],
    next,
    back,
    goTo
  }
}

export default useMultiStepForm
