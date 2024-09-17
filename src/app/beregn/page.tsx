"use client";

import { Chips, VStack } from "@navikt/ds-react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

//Sett interfacene i common.ts

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

 
const ResultPage = () => {
  const router = useRouter();
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { data } = router.query;
      if (data) {
        try {
          const parsedData = JSON.parse(data as string);
          setResultData(parsedData);
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      } 
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <h1>Beregn</h1>
      {resultData ? (
        <pre>{JSON.stringify(resultData, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ResultPage;
