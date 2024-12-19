import { FormContext } from '@/contexts/context'
import { Button, HStack } from '@navikt/ds-react'
import React, { useContext, useEffect } from 'react'
import stepStyles from './styles/stepStyles.module.css'
import { useRouter } from 'next/navigation'

function FormButtons() {
  const context = useContext(FormContext)
  const router = useRouter()

  const { curStep, length, goBack } = context.formPageProps

  useEffect(() => {
    router.prefetch('https://www.nav.no/pensjon/kalkulator/login')
  }, [router])

  return (
    <HStack gap={'2'} className={stepStyles.footerSpacing}>
      <Button type="submit" variant="primary">
        {curStep === length - 1 ? 'Beregn pensjon' : 'Neste'}
      </Button>

      {curStep !== 0 && (
        <Button type="button" variant="secondary" onClick={goBack}>
          Tilbake
        </Button>
      )}

      <Button
        type="button"
        size="medium"
        variant="tertiary"
        onClick={() =>
          router.push('https://www.nav.no/pensjon/kalkulator/login')
        }
      >
        Avbryt
      </Button>
    </HStack>
  )
}

export default FormButtons
