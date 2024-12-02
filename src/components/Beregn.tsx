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
      aarligInntektFoerUttakBeloep: state.aarligInntektFoerUttakBeloep
        ? parseInt(state.aarligInntektFoerUttakBeloep)
        : undefined,
      heltUttakAar: state.heltUttak.uttakAlder.aar!,
      inntektVsaHelPensjonSluttalder:
        state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar,
      inntektVsaHelPensjonBeloep: state.heltUttak.aarligInntektVsaPensjon
        ?.beloep
        ? parseInt(state.heltUttak.aarligInntektVsaPensjon.beloep)
        : undefined,
      gradertUttakAlder: state.gradertUttak?.uttakAlder?.aar,
      gradertUttakInntekt: state.gradertUttak?.aarligInntektVsaPensjonBeloep
        ? parseInt(state.gradertUttak.aarligInntektVsaPensjonBeloep)
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
