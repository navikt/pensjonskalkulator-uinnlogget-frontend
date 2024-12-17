import { HStack, Loader } from '@navikt/ds-react'
import React from 'react'

const LoadingComponent: React.FC = () => (
  <HStack
    data-testid="loader-hstack"
    height={'50vh'}
    align={'center'}
    justify={'center'}
  >
    <Loader
      data-testid="loader"
      aria-label="Laster..."
      size="3xlarge"
      title="Laster..."
    />
  </HStack>
)

export default LoadingComponent
