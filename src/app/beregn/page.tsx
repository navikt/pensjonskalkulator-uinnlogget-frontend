"use client";

import { Table } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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

//Sett interfacet i common.d.ts
interface PensjonData {
  alderspensjon: { alder: number; beloep: number }[];
  afpPrivat: { alder: number; beloep: number }[];
  afpOffentlig: { alder: number; beloep: number }[];
  vilkaarsproeving: { vilkaarErOppfylt: boolean; alternativ: number | string | null }; // Hva er alternativ?
}
 
const BeregnPage = () => {
  const [resultData, setResultData] = useState<PensjonData | null>(null);


  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const dataParam = query.get('data');
    if (dataParam) {
      setResultData(JSON.parse(dataParam));
    }
  }, []);

  const getChartOptions = () => {

    const alderspensjonData = resultData?.alderspensjon.map(item => item.beloep);
    const afpPrivatData = resultData?.afpPrivat.map(item => item.beloep);
    const categories = resultData?.alderspensjon.map(item => item.alder);

    return {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Pension Data'
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
      series: [
        {
          name: 'Alderspensjon',
          data: alderspensjonData
        },
        {
          name: 'AFP Privat',
          data: afpPrivatData
        }
      ]
    };
  }

  return (
    <div>
      <h1>Beregn</h1>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Alder og uttaksgrad</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra folketrygden</Table.HeaderCell>
            <Table.HeaderCell scope="col">AFP privat</Table.HeaderCell>
            <Table.HeaderCell scope="col">Arbeidsinntekt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sum</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* Fyll inn data her (slik som i gamle pensjonskalk.) */}
        </Table.Body>
      </Table>
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

export default BeregnPage;
