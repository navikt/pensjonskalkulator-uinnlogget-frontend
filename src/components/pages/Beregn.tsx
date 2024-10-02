"use client";

import { useContext, useEffect, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FormContext } from "@/contexts/context";
import { ContextForm, FormValueResult, PensjonData } from "@/common";

/* Eksepel på API respons:
{
  "alderspensjon": [
    {
      "alder": 66,
      "beloep": 36430
    },
    {
      "alder": 67,
      "beloep": 43716
    },
    {
      "alder": 68,
      "beloep": 190717
    },
    {
      "alder": 69,
      "beloep": 240269
    },
    {
      "alder": 70,
      "beloep": 240607
    },
    {
      "alder": 71,
      "beloep": 240835
    },
    {
      "alder": 72,
      "beloep": 241066
    },
    {
      "alder": 73,
      "beloep": 241330
    },
    {
      "alder": 74,
      "beloep": 241597
    },
    {
      "alder": 75,
      "beloep": 241895
    },
    {
      "alder": 76,
      "beloep": 242157
    },
    {
      "alder": 77,
      "beloep": 242256
    }
  ],
  "afpPrivat": [
    {
      "alder": 66,
      "beloep": 28480
    },
    {
      "alder": 67,
      "beloep": 14976
    },
    {
      "alder": 68,
      "beloep": 14976
    },
    {
      "alder": 69,
      "beloep": 14976
    },
    {
      "alder": 70,
      "beloep": 14976
    },
    {
      "alder": 71,
      "beloep": 14976
    },
    {
      "alder": 72,
      "beloep": 14976
    },
    {
      "alder": 73,
      "beloep": 14976
    },
    {
      "alder": 74,
      "beloep": 14976
    },
    {
      "alder": 75,
      "beloep": 14976
    }
  ],
  "afpOffentlig": [],
  "vilkaarsproeving": {
    "vilkaarErOppfylt": true,
    "alternativ": null
  }
}
*/

interface BeregnProps {
    beregnResult: FormValueResult;
}
 
const Beregn: React.FC<BeregnProps> = ({ beregnResult }) => {
//const Beregn = (beregnResult : FormValueResult) => {

  const { states, setState } = useContext(FormContext) as ContextForm;

  const getChartOptions = () => {

    const alderspensjonData = beregnResult?.alderspensjon?.map(item => item.beloep) || [];
    const afpPrivatData = beregnResult?.afpPrivat?.map(item => item.beloep) || [];
    const categories = beregnResult?.alderspensjon?.map(item => item.alder) || [];
    const heltUttakAlder = states.heltUttak.uttakAlder.aar;
    const inntektVsaHelPensjonBeloep = states.heltUttak.aarligInntektVsaPensjon.beloep;
    let inntektVsaHelPensjonSluttalder = states.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar;
    /* const heltUttakAlder = 68;
    const inntektVsaHelPensjonBeloep = 111111;
    let inntektVsaHelPensjonSluttalder = 75; */

    const chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Beregnet framtidig alderspensjon (kroner per år):'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Alder'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Beløp'
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [
        {
          name: 'AFP Privat',
          data: afpPrivatData
        },
        {
          name: 'Alderspensjon',
          data: alderspensjonData
        },
      ]
    };
    
    if (inntektVsaHelPensjonBeloep !== 0) {

      const inntektVsaHelPensjonData: number[] = [];
      const inntektVsaHelPensjonInterval: number[] = [];
      if (inntektVsaHelPensjonSluttalder === null || inntektVsaHelPensjonSluttalder === undefined) {
        inntektVsaHelPensjonSluttalder = categories[categories.length - 1];
      } 

      for (let i = heltUttakAlder; i <= inntektVsaHelPensjonSluttalder; i++) {
        inntektVsaHelPensjonData.push(inntektVsaHelPensjonBeloep);
        inntektVsaHelPensjonInterval.push(i);
      }

      const filteredCategories = categories.filter(category => 
        inntektVsaHelPensjonInterval.includes(category)
      );
  
      const filteredInntektVsaHelPensjonData = categories.map(category => 
        filteredCategories.includes(category) ? inntektVsaHelPensjonBeloep : 0
      );
  
      chartOptions.series.push({
        name: 'Inntekt ved siden av hel pensjon',
        data: filteredInntektVsaHelPensjonData
      });
    }

    return chartOptions;
  }

  return (
    <div>
      <h1>Resultat</h1>
      <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions()}
      />  
      {/* {resultData ? (
        <pre>{JSON.stringify(resultData, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )} */}
    </div>
  );
};

export default Beregn;
