import { ErrorMessages, ErrorStatus, SimuleringError } from '@/common'
import { FormContext } from '@/contexts/context'
import { getErrors } from '@/texts/errors'
import { Alert, BodyLong, Box, Button, Heading, VStack } from '@navikt/ds-react'
import { useContext } from 'react'

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
        borderColor="border-default"
        padding="4"
      >
        <VStack gap="3">
          <Heading level="1" size="large">
            Uinnlogget Pensjonskalkulator
          </Heading>
          <Alert variant="warning">
            <VStack gap="6">
              <BodyLong>{mapErrorToMessage(error)}</BodyLong>
              <Box>
                <Button
                  size="medium"
                  variant="secondary-neutral"
                  onClick={() => formPageProps.goTo(0)}
                >
                  Endre
                </Button>
              </Box>
            </VStack>
          </Alert>
        </VStack>
      </Box>
    </>
  )
}

export default ResponseWarning
