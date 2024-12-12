import { useContext, useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FormContext } from '@/contexts/context'
import { getChartOptions } from './utils/chartUtils'
import { Box } from '@navikt/ds-react'
import ResultTable from './ResultTable'
import { SimuleringError, Simuleringsresultat } from '@/common'
import { isSimuleringError } from '@/helpers/typeguards'
import ResponseWarning from './ResponseWarning'
import stepStyles from './styles/stepStyles.module.css'

interface Props {
  simuleringsresultat?: Simuleringsresultat | SimuleringError
}

const Beregn: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state } = useContext(FormContext)

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
    <div>
      <Box
        maxWidth={'70rem'}
        width={'100%'}
        marginInline={'auto'}
        borderColor="border-default"
        padding={'4'}
        borderRadius={'large'}
        role="region"
      >
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
      </Box>
    </div>
  )
}

export default Beregn
