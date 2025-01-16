'use client'

import { State } from '@/common'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Box, ErrorSummary, Heading } from '@navikt/ds-react'
import FormProgressComponent from '@/components/FormProgressComponent'
import stepStyles from '@/components/styles/stepStyles.module.css'
import useErrorHandling from '@/helpers/useErrorHandling'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<State>(initialState)
  const [_errorFields, { validateAllFields, validateFields }] =
    useErrorHandling(state)
  const [curStep, setCurStep] = useState(0)
  const [error, setError] = useState<string[]>([])

  const completedSteps = useRef<string[]>([])

  const pathname = usePathname()
  const router = useRouter()
  const routeNames: { [index: string]: string } = {
    alder: 'Alder og yrkesaktivitet',
    utland: 'Opphold utenfor Norge',
    inntekt: 'Inntekt og alderspensjon',
    sivilstand: 'Sivilstand',
    afp: 'Avtalefestet pensjon (AFP)',
    beregn: 'Beregn',
  }

  const routes = Object.keys(routeNames)

  useEffect(() => {
    console.log(completedSteps.current)

    if (pathname) {
      const currentPage = pathname.split('/').pop()!
      const index = routes.indexOf(currentPage)
      setCurStep(index)
      console.log(currentPage)

      if (completedSteps.current.includes(currentPage)) {
        console.log('completed')

        validateFields('InntektStep')
      }
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
    if (curStep === length - 2) {
      const unvalidSteps = validateAllFields()
      if (unvalidSteps.length > 0) {
        // router.replace(unvalidSteps[0])
        setError(unvalidSteps)
        return
      }
    }
    if (curStep < length - 1) {
      completedSteps.current.push(routes[curStep])
      router.push(routes[curStep + 1])
    }
  }

  const goBack = () => {
    if (curStep > 0) {
      router.replace(routes[curStep - 1])
    }
  }

  const goToRoute = (route: string) => {
    console.log(route)

    router.replace(route)
  }

  const FeilOppsummering = () => {
    const errorNames = error.map((e) => routeNames[e])
    return (
      <ErrorSummary>
        {errorNames.map((e) => (
          <ErrorSummary.Item
            onClick={() =>
              goToRoute(routes[Object.values(routeNames).indexOf(e)])
            }
            key={e}
          >
            Feil under {e}
          </ErrorSummary.Item>
        ))}
      </ErrorSummary>
    )
  }

  return (
    <>
      <FormContext.Provider
        value={{
          setState: setState,
          state: state,
          completedSteps: completedSteps.current,
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
            {error.length > 0 && <FeilOppsummering />}
          </Box>
        ) : (
          children
        )}
      </FormContext.Provider>
    </>
  )
}
