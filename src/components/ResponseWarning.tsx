import { ErrorMessages, ErrorStatus, SimuleringError } from '@/common'
import { FormContext } from '@/contexts/context'
import { getErrors } from '@/texts/errors'
import { Alert, BodyLong, Box, Button, VStack } from '@navikt/ds-react'
import { useContext } from 'react'

interface SimuleringErrorProps {
  error?: SimuleringError
}

function ResponseWarning({ error }: SimuleringErrorProps) {
  const { formPageProps } = useContext(FormContext)

  const mapErrorToMessage = (error: SimuleringError | undefined) => {
    const errorMessages = getErrors() as ErrorMessages
    if (!error) return errorMessages['default']
    const errorCode = error.status as ErrorStatus
    return errorMessages[errorCode]
  }

  return (
    <>
      {/* <Heading level="1">Uinnlogget Pensjonskalkulator</Heading> */}
      <Box
        maxWidth={'40rem'}
        width={'100%'}
        marginInline={'auto'}
        borderColor="border-default"
      >
        <Alert variant="warning">
          <VStack gap="3">
            <BodyLong spacing>{mapErrorToMessage(error)}</BodyLong>
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
      </Box>
    </>
  )
}

export default ResponseWarning
