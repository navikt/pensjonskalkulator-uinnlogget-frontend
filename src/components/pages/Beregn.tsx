'use client'

import { useContext } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValueResult, PensjonData } from '@/common'
import { Box, Table } from '@navikt/ds-react'
import ResultTable from '../ResultTable'

interface BeregnProps {
  beregnResult: FormValueResult
}

const Beregn: React.FC<BeregnProps> = ({ beregnResult }) => {
  const { states, setState } = useContext(FormContext) as ContextForm

  const getChartOptions = () => {
    const alderspensjonData =
      beregnResult?.alderspensjon?.map((item) => item.beloep) || []
    const afpPrivatData =
      beregnResult?.afpPrivat?.map((item) => item.beloep) || []
    const categories =
      beregnResult?.alderspensjon?.map((item) => item.alder) || []
    const heltUttakAlder = states.heltUttak.uttakAlder.aar
    const inntektVsaHelPensjonBeloep =
      states.heltUttak.aarligInntektVsaPensjon?.beloep
    let inntektVsaHelPensjonSluttalder =
      states.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar

    const chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Beregnet framtidig alderspensjon (kroner per år):',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Alder',
        },
      },
      yAxis: {
        min: 0,

        title: {
          text: 'Beløp',
        },
      },
      credits: {
        enabled: false, // Disable the Highcharts watermark
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      series: [
        {
          name: 'AFP Privat',
          data: afpPrivatData,
        },
        {
          name: 'Alderspensjon',
          data: alderspensjonData,
        },
      ],
    }

    if (inntektVsaHelPensjonBeloep !== 0 && inntektVsaHelPensjonBeloep !== undefined) {
        const inntektVsaHelPensjonData = [];
        const inntektVsaHelPensjonInterval: number[] = [];
        
        if (
          inntektVsaHelPensjonSluttalder === null ||
          inntektVsaHelPensjonSluttalder === undefined
        ) {
          inntektVsaHelPensjonSluttalder = categories[categories.length - 1];
        }
      
        for (let i = heltUttakAlder; i <= inntektVsaHelPensjonSluttalder; i++) {
          inntektVsaHelPensjonData.push(inntektVsaHelPensjonBeloep);
          inntektVsaHelPensjonInterval.push(i);
        }
      
        const filteredCategories = categories.filter((category) =>
          inntektVsaHelPensjonInterval.includes(category)
        );
      
        const filteredInntektVsaHelPensjonData = categories.map((category) =>
          filteredCategories.includes(category) ? inntektVsaHelPensjonBeloep : 0
        ).filter((item): item is number => item !== undefined);
      
        chartOptions.series.push({
          name: 'Inntekt ved siden av hel pensjon',
          data: filteredInntektVsaHelPensjonData,
        });
      }

    return chartOptions
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
      >
        <h1>Resultat</h1>
        <ResultTable beregnResult={beregnResult} />
        <HighchartsReact highcharts={Highcharts} options={getChartOptions()} />
      </Box>
    </div>
  )
}

export default Beregn
