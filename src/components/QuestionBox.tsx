import { Box, Button, HStack, TextField, VStack } from '@navikt/ds-react'
import React from 'react'

export default function QuestionBox() {
  return (
    <Box background='surface-subtle'>
      <VStack align={'center'} padding={'2'}>
        <h1>Test</h1>
        <Box width={'fit-content'} padding={'4'} background='bg-default'>
          <Button>Neste</Button>
        </Box>
      </VStack>
    </Box>
  )
}
