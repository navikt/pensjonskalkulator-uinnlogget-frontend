import { SimuleringError } from '@/common'
import { FormContext } from '@/contexts/context'
import { getErrors } from '@/texts/errors'
import { Alert, BodyLong, Box, Button, Heading, VStack } from '@navikt/ds-react'
import React, { useContext } from 'react'

interface ResponseWarningProps {
  error: SimuleringError | undefined
}

function ResponseWarning({ error }: ResponseWarningProps) {
  const { formPageProps } = useContext(FormContext)

  const mapErrorToMessage = (error: SimuleringError | undefined) => {
    const errorMessages: { [key: string]: string } = getErrors()
    if (!error) return errorMessages['default']
    const errorCode = error.status
    return errorMessages[errorCode]
  }

  return (
    <Box padding={'10'}>
      <Alert variant="warning">
        <Heading spacing size="small" level="3">
          Viktig informasjon
        </Heading>
        <VStack gap="3">
          <BodyLong spacing>{mapErrorToMessage(error)}</BodyLong>
          <Box>
            <Button
              size="medium"
              variant="secondary-neutral"
              onClick={() => formPageProps.onStepChange(0)}
            >
              Endre
            </Button>
          </Box>
        </VStack>
      </Alert>
    </Box>
  )
}

export default ResponseWarning
