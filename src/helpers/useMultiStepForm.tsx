'use client'
import { on } from 'events'
import React, { ReactElement, useState } from 'react'

interface Pages {
  [key: string]: JSX.Element
}

function useMultiStepForm(steps: Pages, onChange?: (e: number) => void) {
  const [curStep, setCurStep] = useState(0)
  const pages = Object.keys(steps)

  const next = () => {
    setCurStep((prev) => {
      prev = prev + 1
      onChange && onChange(prev)
      return prev
    })
    onChange && onChange(curStep)
  }

  const back = () => {
    setCurStep((prev) => {
      prev = prev - 1
      onChange && onChange(prev)
      return prev
    })
  }

  const goTo = (step: number) => {
    setCurStep(step)
    onChange && onChange(step)
  }

  return {
    curStep,
    step: steps[pages[curStep]],
    next,
    back,
    goTo,
    stepName: pages[curStep]
  }
}

export default useMultiStepForm
