import React from 'react'
import { Box, Loader } from '@navikt/ds-react'

const LoadingComponent: React.FC = () => (
  <Box
    data-testid="box"
    height={'50vh'}
    maxWidth={'fit-content'}
    marginInline={'auto'}
    style={{ alignItems: 'center' }}
  >
    <Loader data-testid="loader" size="3xlarge" title="Laster..." />
  </Box>
)

export default LoadingComponent
