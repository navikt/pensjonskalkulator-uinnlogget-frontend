import { Box } from '@navikt/ds-react'
import React, { ReactNode } from 'react'

interface SubstepProps {
  children: ReactNode
}

function Substep({ children }: SubstepProps) {
  return (
    <Box marginBlock="8" borderWidth="1 0 0 0" borderColor="border-subtle">
      <Box marginBlock="8">{children}</Box>
    </Box>
  )
}

export default Substep
