'use client'

import { useState } from 'react'

interface Pages {
  [key: string]: JSX.Element
}

function useMultiStepForm(steps: Pages, lastPage: JSX.Element) {
  const [curStep, setCurStep] = useState(0)
  const pages = Object.keys(steps)

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const goToNext = () => {
    setCurStep((prev) => {
      if (prev < pages.length) {
        return prev + 1
      }
      return prev
    })
    scrollToTop()
  }

  const goBack = () => {
    setCurStep((prev) => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
    scrollToTop()
  }

  const goTo = (step: number) => {
    if (step >= 0 && step <= pages.length) {
      setCurStep(step)
    }
    scrollToTop()
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
