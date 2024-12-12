import { SimuleringError, Simuleringsresultat } from '@/common'
import { FormContext } from '@/contexts/context'
import { isSimuleringError } from '@/helpers/typeguards'
import { Box, Button, HStack, VStack } from '@navikt/ds-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useContext, useMemo } from 'react'
import ResponseWarning from './ResponseWarning'
import stepStyles from './styles/stepStyles.module.css'
import ResultTable from './ResultTable'
import { getChartOptions } from './utils/chartUtils'

interface Props {
  simuleringsresultat?: Simuleringsresultat | SimuleringError
}

const Beregn: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state, formPageProps } = useContext(FormContext)

  if (
    isSimuleringError(simuleringsresultat) ||
    simuleringsresultat === undefined
  ) {
    return <ResponseWarning error={simuleringsresultat} />
  }

  const chartOptions = useMemo(() => {
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
  }, [state, simuleringsresultat])

  return (
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
        <h1 className={stepStyles.overskrift}>Uinnlogget pensjonskalkulator</h1>
        <h2 className={stepStyles.underOverskrift}>Beregning</h2>
        <>
          <div role="img" aria-labelledby="alt-chart-title">
            <div id="alt-chart-title" hidden>
              Grafisk fremstilling av pensjonssimulering
            </div>
            <div data-testid="highcharts-aria-wrapper" aria-hidden={true}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                containerProps={{ 'data-testid': 'highcharts-react' }}
              />
            </div>
          </div>
          <ResultTable simuleringsresultat={simuleringsresultat} />
        </>
        <HStack
          marginInline="auto"
          width="100%"
          className={stepStyles.footerSpacing}
        >
          <Button onClick={() => formPageProps.goTo(0)} variant="secondary">
            Tilbake til start
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default Beregn
