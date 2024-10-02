import React from 'react'
import { Box, Loader } from '@navikt/ds-react'

const LoadingComponent: React.FC = () => (
  <Box
    height={'50vh'}
    maxWidth={'fit-content'}
    marginInline={'auto'}
    style={{ alignItems: 'center' }}
  >
    <Loader size="3xlarge" title="Laster..." />
  </Box>
)

export default LoadingComponent
