import { Box, HStack, Loader } from '@navikt/ds-react'
import React from 'react'

const LoadingComponent: React.FC = () => (
  <Box
    data-testid="box"
    height={'50vh'}
    maxWidth={'fit-content'}
    marginInline={'auto'}
  >
    <HStack height="80%" align={'center'}>
      <Loader data-testid="loader" size="3xlarge" title="Laster..." />
    </HStack>
  </Box>
)

export default LoadingComponent
