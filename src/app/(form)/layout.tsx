'use client'

import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Box, Heading } from '@navikt/ds-react'
import FormProgressComponent from '@/components/FormProgressComponent'
import stepStyles from '@/components/styles/stepStyles.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<State>(initialState)
  const [curStep, setCurStep] = useState(0)

  const pathname = usePathname()
  const router = useRouter()
  const routes = ['alder', 'utland', 'inntekt', 'sivilstand', 'afp', 'beregn']

  useEffect(() => {
    if (pathname) {
      const currentPage = pathname.split('/').pop()!
      const index = routes.indexOf(currentPage)
      setCurStep(index)
    }
  }, [pathname])

  const length = routes.length

  useEffect(() => {
    if (curStep < length - 1) router.prefetch('/' + routes[curStep + 1])
  }, [curStep])

  const goTo = (step: number) => {
    setCurStep(step)
  }

  const goToNext = () => {
    if (curStep < length - 1) {
      router.push(routes[curStep + 1])
    }
  }

  const goBack = () => {
    if (curStep > 0) {
      router.replace(routes[curStep - 1])
    }
  }

  return (
    <>
      <FormContext.Provider
        value={{
          setState: setState,
          state: state,
          formPageProps: {
            curStep,
            length: length - 1,
            goBack,
            goToNext,
            goTo,
          },
        }}
      >
        {curStep !== length - 1 ? (
          <Box
            maxWidth={'40rem'}
            width={'100%'}
            marginInline={'auto'}
            borderColor="border-default"
            padding={'4'}
            borderRadius={'large'}
          >
            <Heading level="1" size="large" className={stepStyles.overskrift}>
              Uinnlogget pensjonskalkulator
            </Heading>
            <FormProgressComponent
              totalSteps={length - 1}
              activeStep={curStep}
            />
            {children}
          </Box>
        ) : (
          children
        )}
      </FormContext.Provider>
    </>
  )
}
