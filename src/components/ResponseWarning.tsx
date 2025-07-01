import { useRouter } from 'next/navigation'
import { useContext, useEffect, useMemo } from 'react'

import {
  Alert,
  BodyLong,
  Box,
  Button,
  HStack,
  Heading,
  VStack,
} from '@navikt/ds-react'

import { logger } from './utils/logging'
import { ErrorMessages, ErrorStatus, SimuleringError } from '@/common'
import { FormContext } from '@/contexts/context'
import { getErrors } from '@/texts/errors'

import stepStyles from '@/components/styles/stepStyles.module.css'

interface SimuleringErrorProps {
  error?: SimuleringError
}

function ResponseWarning({ error }: SimuleringErrorProps) {
  const { formPageProps } = useContext(FormContext)
  const router = useRouter()

  const mapErrorToMessage = (error: SimuleringError | undefined) => {
    const errorMessages = getErrors() as ErrorMessages

    if (!error) throw new Error('Error is undefined')
    const errorCode = error.status as ErrorStatus
    return errorMessages[errorCode]
  }

  const errorMessage = useMemo(() => mapErrorToMessage(error), [error])

  useEffect(() => {
    logger('alert', { tekst: errorMessage })
  }, [errorMessage])

  useEffect(() => {
    router.prefetch('https://www.nav.no/pensjon/kalkulator/login')
  }, [router])

  return (
    <>
      <Box
        maxWidth={'40rem'}
        width={'100%'}
        marginInline={'auto'}
        padding="4"
        marginBlock={'0 9'}
      >
        <VStack gap="4">
          <Heading level="1" size="large" className={stepStyles.overskrift}>
            Uinnlogget Pensjonskalkulator
          </Heading>
          <Alert variant="warning">
            <VStack gap="6">
              <BodyLong>{errorMessage}</BodyLong>
              <HStack gap={'4'}>
                <Button
                  size="medium"
                  variant="secondary-neutral"
                  onClick={() => formPageProps.goTo(2)}
                >
                  Endre uttak
                </Button>
                <Button
                  size="medium"
                  variant="secondary-neutral"
                  onClick={() =>
                    router.push('https://www.nav.no/pensjon/kalkulator/login')
                  }
                >
                  Avbryt
                </Button>
              </HStack>
            </VStack>
          </Alert>
        </VStack>
      </Box>
    </>
  )
}

export default ResponseWarning
