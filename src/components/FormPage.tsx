"use client";

import { ContextForm, FormValueResult, FormValues, StepRef } from "@/common";
import AFPStep from "@/components/pages/AFPStep";
import AlderStep from "@/components/pages/AlderStep";
import InntektStep from "@/components/pages/InntektStep";
import UtlandsStep from "./pages/UtlandsStep";
import StepBox from "@/components/StepBox";
import { FormContext } from "@/contexts/context";
import useMultiStepForm from "@/helpers/useMultiStepForm";
import {
  Box,
  Button,
  FormProgress,
  HStack,
  Alert,
  Loader,
  ProgressBar,
} from "@navikt/ds-react";
import Link from "next/link";

import React, {
  cloneElement,
  FormEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import EktefelleStep from "./pages/EktefelleStep";
import { useRouter } from "next/navigation";
import submitForm from "@/functions/submitForm";
import Beregn from "./pages/Beregn";

const initialFormState: FormValues = {
  simuleringType: null,
  foedselAar: 0,
  sivilstand: "UGIFT",
  epsHarInntektOver2G: null,
  epsHarPensjon: null,
  boddIUtland: "", // fjernes fra ApiPayloaded
  inntektVsaHelPensjon: "", // fjernes fra ApiPayloaded
  utenlandsAntallAar: 0,
  inntektOver1GAntallAar: 0,
  aarligInntektFoerUttakBeloep: 0,
  gradertUttak: {
    grad: 0,
    uttakAlder: {
      aar: null,
      maaneder: null,
    },
    aarligInntektVsaPensjonBeloep: 0,
  },
  heltUttak: {
    uttakAlder: {
      aar: 0,
      maaneder: -1,
    },
    aarligInntektVsaPensjon: {
      beloep: 0,
      sluttAlder: {
        aar: null,
        maaneder: null,
      },
    },
  },
};

interface FormPageProps {
  grunnbelop: number;
}

interface Pages {
  [key: string]: JSX.Element;
}

function FormPage({ grunnbelop }: FormPageProps) {
  const [formState, setFormSate] = useState<FormValues>(initialFormState);
  const [failedToSubmit, setFailedToSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [beregnResult, setBeregnResult] = useState<FormValueResult>();
  const [showBeregnPage, setShowBeregnPage] = useState(false);
  const childRef = useRef<StepRef>(null); // Ref to access child component method
  const router = useRouter();

  const pagesDict: Pages = {
    alder: <AlderStep key="alder" />,
    utland: <UtlandsStep key="utland" />,
    inntekt: <InntektStep key="inntekt" />,
    ektefelle: <EktefelleStep grunnbelop={grunnbelop} key="ektefelle" />,
    afp: <AFPStep grunnbelop={grunnbelop} key="afp" />,
  };
  const pagesNames = Object.keys(pagesDict);

  const { curStep, step, next, back, goTo, stepName } = useMultiStepForm(
    pagesDict,
    (e: number) => {
      // history.pushState({ page: curStep }, '', `${pagesNames[e]}`)
    }
  );
  const length = pagesNames.length;

  const handleSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (curStep === length - 1) {
      setLoading(true);
      try{
        const resultData = await submitForm(formState);
        setBeregnResult(resultData);
        console.log(resultData);
      } catch (error) {
        console.error(error);
      } finally{
        setLoading(false);
        setShowBeregnPage(true);
      }

      /* if (resultData) {
        const params = new URLSearchParams({ data: JSON.stringify(resultData) }).toString();
        router.push(`/beregn?${params}`); 
      } else {
        setFailedToSubmit(true);
      }
      return; */
    }
    if (childRef.current?.onSubmit()) {
      next();
    }
  };

/*   const handleSubmit = async (e: FormEvent) => { 
    e.preventDefault();
    if (curStep === length - 1) {
      setLoading(true);
      //const resultData = await submitForm(formState);
  
      const mockData = {
        alderspensjon: [
          { alder: 66, beloep: 36430 },
          { alder: 67, beloep: 43716 },
          { alder: 68, beloep: 190717 },
          { alder: 69, beloep: 240269 },
          { alder: 70, beloep: 240607 },
          { alder: 71, beloep: 240835 },
          { alder: 72, beloep: 241066 },
          { alder: 73, beloep: 241330 },
          { alder: 74, beloep: 241597 },
          { alder: 75, beloep: 241895 },
          { alder: 76, beloep: 242157 },
          { alder: 77, beloep: 242256 }
        ],
        afpPrivat: [
          { alder: 66, beloep: 28480 },
          { alder: 67, beloep: 14976 },
          { alder: 68, beloep: 14976 },
          { alder: 69, beloep: 14976 },
          { alder: 70, beloep: 14976 },
          { alder: 71, beloep: 14976 },
          { alder: 72, beloep: 14976 },
          { alder: 73, beloep: 14976 },
          { alder: 74, beloep: 14976 },
          { alder: 75, beloep: 14976 }
        ],
        afpOffentlig: [],
        vilkaarsproeving: {
          vilkaarErOppfylt: true,
          alternativ: null
        }
      };
  
      const params = new URLSearchParams({ data: JSON.stringify(mockData) }).toString();
      router.push(`/beregn?${params}`); 
      return;
    }
    if (childRef.current?.onSubmit()) {
      next();
    }
  }; */

  useEffect(() => {
    // Listen for the popstate event (triggered by back/forward navigation)
    const handlePopState = (event: any) => {
      // Retrieve state from event and update the pageState accordingly
      if (event.state) {
        goTo(event.state.page);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener("popstate", handlePopState);
    };
  }, [goTo]);

  const handleGoTo = (step: number) => {
    goTo(step);
    // router.push(`${stepName}`)
  };

  return (
    <Box padding={{ lg: "10", sm: "5" }} width={"full"} background="bg-default">
      <Box
        maxWidth={"40rem"}
        width={"100%"}
        marginInline={"auto"}
        borderColor="border-default"
        // borderWidth='1'
        padding={"4"}
        borderRadius={"large"}
      >
        <div className="mb-3 text-left">
          <h2>Pensjonskalkulator</h2>
        </div>
        <Box width={"100%"} padding={"4"} background="bg-default">
          {failedToSubmit && (
            <Alert variant="error">
              Error - Data ble ikke sendt. Sjekk om alt er fylt inn riktig.
            </Alert>
          )}
          <FormProgress
            totalSteps={length}
            activeStep={curStep + 1}
            onStepChange={(newStep) => handleGoTo(newStep - 1)}
          >
            <FormProgress.Step>Alder</FormProgress.Step>
            <FormProgress.Step>Utland</FormProgress.Step>
            <FormProgress.Step>Inntekt og alderspensjon</FormProgress.Step>
            <FormProgress.Step>Ektefelle</FormProgress.Step>
            <FormProgress.Step>AFP</FormProgress.Step>
          </FormProgress>
          <form onSubmit={handleSubmit}>
            <FormContext.Provider
              value={{ setState: setFormSate, states: formState }}
            >
              {cloneElement(step, { ref: childRef })}
            </FormContext.Provider>
            <HStack gap={"2"} marginBlock="2">
              <Button type="submit" variant="primary">
                {curStep === length - 1 ? "Send" : "Neste"}
              </Button>
              {curStep !== 0 && (
                <Button type="button" onClick={back} variant="tertiary">
                  Forrige
                </Button>
              )}
            </HStack>
            {loading && (
              <HStack gap={"2"} marginBlock="2">
                <Loader size="large" title="Laster..."/>
              </HStack>
            )}
          </form>
          {(showBeregnPage && beregnResult) && (
            <Beregn beregnResult={beregnResult}/>
          )}
        </Box>
      </Box>
      {/* </div> */}
    </Box>
  );
}

export default FormPage;
