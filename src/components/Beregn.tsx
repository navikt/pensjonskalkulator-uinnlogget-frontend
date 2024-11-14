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
    return getChartOptions({
      simuleringsresultat,
      heltUttakAar: state.heltUttak.uttakAlder.aar,
      inntektVsaHelPensjonSluttalder:
        state.heltUttak.aarligInntektVsaPensjon?.beloep,
      inntektVsaHelPensjonBeloep:
        state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar,
    })
  }, [state, simuleringsresultat])

  if (!simuleringsresultat) {
    return (
      // TODO PEK-722 vise fornuftig feilmelding
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
