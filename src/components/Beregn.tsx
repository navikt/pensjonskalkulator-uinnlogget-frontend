import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useContext, useEffect, useMemo, useRef } from 'react'

import { Box, Button, HStack, Heading, VStack } from '@navikt/ds-react'

import Forbehold from './Forbehold'
import ResponseWarning from './ResponseWarning'
import ResultTable from './ResultTable'
import { getChartOptions } from './utils/chartUtils'
import { logger } from './utils/logging'
import { SimuleringError, Simuleringsresultat } from '@/common'
import { FormContext } from '@/contexts/context'
import { isSimuleringError } from '@/helpers/typeguards'

import stepStyles from './styles/stepStyles.module.css'

interface Props {
  simuleringsresultat?: Simuleringsresultat | SimuleringError
}

const Beregn: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state, formPageProps } = useContext(FormContext)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const validSimResult =
    !isSimuleringError(simuleringsresultat) && simuleringsresultat !== undefined

  const invalidSimResult =
    isSimuleringError(simuleringsresultat) || simuleringsresultat === undefined

  useEffect(() => {
    // Load Highcharts accessibility module only on client side
    if (typeof window !== 'undefined') {
      import('highcharts/modules/accessibility')
    }
  }, [])

  useEffect(() => {
    if (validSimResult) {
      if (headingRef.current) {
        headingRef.current.focus()
      }
      logger('resultat vist', { tekst: 'Beregning' })
    }
  }, [validSimResult])

  const chartOptions: Highcharts.Options | null = useMemo(() => {
    if (invalidSimResult) {
      return null
    }
    return getChartOptions({
      simuleringsresultat,
      aarligInntektFoerUttakBeloep: state.aarligInntektFoerUttakBeloep!,
      heltUttakAar: state.heltUttak.uttaksalder.aar!,
      inntektVsaHelPensjonSluttalder:
        state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar,
      inntektVsaHelPensjonBeloep:
        state.heltUttak.aarligInntektVsaPensjon?.beloep,
      gradertUttakAlder: state.gradertUttak?.uttaksalder?.aar,
      gradertUttakInntekt: state.gradertUttak?.aarligInntektVsaPensjonBeloep
        ? state.gradertUttak?.aarligInntektVsaPensjonBeloep
        : undefined,
    })
  }, [state, simuleringsresultat, invalidSimResult])

  return invalidSimResult ? (
    <ResponseWarning error={simuleringsresultat} />
  ) : (
    <Box
      maxWidth={'70rem'}
      width={'100%'}
      marginInline={'auto'}
      borderColor="border-default"
      padding={'4'}
      borderRadius={'large'}
      role="region"
    >
      <VStack gap="4" width="100%">
        <Heading level="1" size="large" className={stepStyles.overskrift}>
          Uinnlogget pensjonskalkulator
        </Heading>

        <Heading
          ref={headingRef}
          level="2"
          size="medium"
          className={stepStyles.underOverskrift}
          tabIndex={-1}
        >
          Beregning
        </Heading>

        <>
          <div role="img" aria-labelledby="alt-chart-title">
            <div id="alt-chart-title" hidden>
              Årlig inntekt og pensjon etter uttak i kroner
            </div>
            <div data-testid="highcharts-aria-wrapper" aria-hidden={true}>
              {chartOptions && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                  containerProps={{ 'data-testid': 'highcharts-react' }}
                />
              )}
            </div>
          </div>
          <ResultTable simuleringsresultat={simuleringsresultat} />
        </>

        <Box maxWidth={{ md: '50%', xs: '100%' }}>
          <Forbehold />
        </Box>

        <HStack
          marginInline="auto"
          width="100%"
          className={stepStyles.footerSpacing}
        >
          <Button
            onClick={() => formPageProps.goTo(0)}
            variant="secondary"
            className={stepStyles.footerSpacing}
          >
            Tilbake til start
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default Beregn
