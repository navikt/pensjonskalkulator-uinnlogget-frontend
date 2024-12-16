import { ErrorMessages, ErrorStatus, SimuleringError } from '@/common'
import { FormContext } from '@/contexts/context'
import { getErrors } from '@/texts/errors'
import {
  Alert,
  BodyLong,
  Box,
  Button,
  Heading,
  HStack,
  VStack,
} from '@navikt/ds-react'
import { useContext } from 'react'
import stepStyles from '/src/components/styles/stepStyles.module.css'
import Link from 'next/link'

interface SimuleringErrorProps {
  error?: SimuleringError
}

function ResponseWarning({ error }: SimuleringErrorProps) {
  const { formPageProps } = useContext(FormContext)

  const mapErrorToMessage = (error: SimuleringError | undefined) => {
    const errorMessages = getErrors() as ErrorMessages

    if (!error) throw new Error('Error is undefined')
    const errorCode = error.status as ErrorStatus
    return errorMessages[errorCode]
  }

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
              <BodyLong>{mapErrorToMessage(error)}</BodyLong>
              <HStack gap={'4'}>
                <Button
                  size="medium"
                  variant="secondary-neutral"
                  onClick={() => formPageProps.goTo(2)}
                >
                  Endre uttak
                </Button>
                <Link href="/">
                  <Button size="medium" variant="secondary-neutral">
                    Avbryt
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Alert>
        </VStack>
      </Box>
    </>
  )
}

export default ResponseWarning
