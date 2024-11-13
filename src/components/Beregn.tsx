import { useContext, useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FormContext } from '@/contexts/context'
import { getChartOptions } from './utils/chartUtils'
import { Box } from '@navikt/ds-react'
import ResultTable from './ResultTable'
import { Simuleringsresultat } from '@/common'

interface Props {
  simuleringsresultat?: Simuleringsresultat
}

const Beregn: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state } = useContext(FormContext)

  const chartOptions = useMemo(() => {
    const heltUttakAlder = state.heltUttak.uttakAlder.aar
    const inntektVsaHelPensjonBeloep =
      state.heltUttak.aarligInntektVsaPensjon?.beloep ?? 0
    const inntektVsaHelPensjonSluttalder =
      state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar ?? 0

    return getChartOptions(
      heltUttakAlder,
      inntektVsaHelPensjonSluttalder,
      inntektVsaHelPensjonBeloep,
      simuleringsresultat
    )
  }, [state, simuleringsresultat])

  if (!simuleringsresultat) {
    return (
      <div>
        <h1>Woopsy</h1>
        <p>We are having an error</p>
      </div>
    )
  }
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
        <h1>Resultat</h1>
        <>
          <ResultTable
            alderspensjon={simuleringsresultat.alderspensjon}
            afpPrivat={simuleringsresultat.afpPrivat}
          />

          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{ 'data-testid': 'highcharts-react' }}
          />
        </>
      </Box>
    </div>
  )
}

export default Beregn
