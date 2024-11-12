import { useContext, useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FormContext } from '@/contexts/context'
import { getChartOptions } from './utils/chartUtils'
import { Box } from '@navikt/ds-react'
import ResultTable from './ResultTable'
import { Simuleringsresultat } from '@/common'

interface BeregnResource {
  asyncSimuleringsresultat: { read(): Simuleringsresultat | undefined }
}

const Beregn: React.FC<BeregnResource> = ({ asyncSimuleringsresultat }) => {
  const { state } = useContext(FormContext)
  const simuleringsresultat = asyncSimuleringsresultat.read()

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
          {simuleringsresultat && (
            <ResultTable
              alderspensjon={simuleringsresultat.alderspensjon}
              afpPrivat={simuleringsresultat.afpPrivat}
            />
          )}
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
