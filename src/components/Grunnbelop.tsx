import React from 'react'

import { getGrunnbelop } from '@/functions/functions'
import { Radio, RadioGroup } from '@navikt/ds-react'

async function Grunnbelop() {
  const grunnbelop = await getGrunnbelop()
  const ektefelleText = `Har du ektefelle, partner eller samboer som har inntekt større enn ${grunnbelop}kr når du starter å ta ut pensjon?`

  return (
    <RadioGroup legend={ektefelleText}>
      <Radio value='ja'>Ja</Radio>
      <Radio value='nei'>Nei</Radio>
    </RadioGroup>
  )
}

export default Grunnbelop
