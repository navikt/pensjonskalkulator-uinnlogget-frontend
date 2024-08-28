import React, {
  forwardRef,
  ReactElement,
  Suspense,
  use,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import FormWrapper from "../FormWrapper";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField,
} from "@navikt/ds-react";
import { FormContext } from "@/contexts/context";
import { ContextForm, FormValues, StepRef } from "@/common";
import { PlusCircleIcon } from "@navikt/aksel-icons";

import { getGrunnbelop } from "@/functions/functions";
import Substep from "../Substep";

const InntektStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm;
  const [errorFields, setErrorFields] = React.useState({
    inntekt: false,
    alderTaUt: false,
    uttaksgrad: false,
  });
  const [errorMsgInntekt, setErrorMsgInntekt] = useState<string | null>(null);
  const [errorMsgTaUt, setErrorMsgTaUt] = useState<string | null>(null);
  const [errorMsgUttaksgrad, setErrorMsgUttaksgrad] = useState<string | null>(null);
  const [inputArray, setInputArray] = useState<ReactElement[]>([]);

  const addInputField = () => {
    return (
      <TextField
        onChange={(it) =>
          setState((prev: FormValues) => ({
            ...prev,
            inntekt: it.target.value,
          }))
        }
        label="Inntekt"
        value={states.inntekt || ""}
        error={errorMsgInntekt}
        key={inputArray.length}
      />
    );
  };

  useImperativeHandle(ref, () => ({
    onSubmit() {

      console.log(states.uttaksgrad);
      var willContinue = true;
      
      const errors = {
        inntekt: !states.inntekt,
        alderTaUt: !states.alderTaUt,
        uttaksgrad: !states.uttaksgrad,
      };

      setErrorFields(errors);
      
      if (Object.values(errors).some((error) => error)) {
        
        if (!states.inntekt) {
          setErrorMsgInntekt("Du må fylle ut inntekt");
        }
       
        if (parseInt(states.inntekt) < 0) {
          setErrorMsgInntekt("Inntekt kan ikke være negativ");
        }
        
        if(states.alderTaUt === ""){
          setErrorMsgTaUt("Velg alder for uttak av pensjon");
        }

        if(states.uttaksgrad === ""){
          setErrorMsgUttaksgrad("Velg uttaksgrad");
        }

        willContinue = false;
        
      } 

      return willContinue;
    },
  }));

  return (
    <FormWrapper>
      <h2>Inntekt</h2>
      <div className="w-30">
        <TextField
          onChange={(it) =>
            setState((prev: FormValues) => ({
              ...prev,
              inntekt: it.target.value,
            }))
          }
          label="Hva er din forventede årlige inntekt?"
          description="Dagens kroneverdi før skatt"
          value={states.inntekt}
          error={errorFields.inntekt ? errorMsgInntekt : ""}
        />
        {inputArray.map((input) => input)}
        {/* <Button
          onClick={() => setInputArray((prev) => [...prev, addInputField()])}
          icon={<PlusCircleIcon />}
          variant="tertiary"
        >
          Legg til
        </Button> */}
        <ReadMore header="Om pensjonsgivende inntekt">
          Dette regnes som pensjonsgivende inntekt: all lønnsinntekt for
          lønnstakere personinntekt fra næring for selvstendige foreldrepenger
          sykepenger dagpenger arbeidsavklaringspenger omstillingsstønad
          omsorgsstønad fosterhjemsgodtgjørelse (den delen som utgjør
          arbeidsgodtgjørelse) førstegangstjeneste (hvis påbegynt tidligst i
          2010) Pensjonsgivende inntekt har betydning for retten til og
          størrelsen på alderspensjon og andre pensjonsytelser. Den
          pensjonsgivende inntekten beregnes av Skatteetaten. Uføretrygd regnes
          ikke som pensjonsgivende inntekt. Uføretrygd gir opptjening til
          alderspensjon basert på antatt inntekt til og med året du fyller 61
          år.
        </ReadMore>

        <Substep>
          <Select
            value={states.alderTaUt}
            style={{ width: "5rem" }}
            label={"Når planlegger du å ta ut pensjon?"}
            description="Oppgi alder"
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                alderTaUt: it.target.value
              }))
            }
            error={errorFields.alderTaUt ? errorMsgTaUt : ""}
          >
            <option value={""}>----</option>
            {Array.from({ length: 14 }, (_, i) => (
              <option value={i + 62} key={i}>
                {i + 62} år
              </option>
            ))}
          </Select>
        </Substep>
        <Substep>
          <Select
            value={states.uttaksgrad}
            style={{ width: "5rem" }}
            label={"Hvilken uttaksgrad ønsker du?"}
            onChange={(it) => {
              setState((prev: FormValues) => ({
                ...prev,
                uttaksgrad: it.target.value
              }))
            }}
            error={errorFields.uttaksgrad ? errorMsgUttaksgrad : ""}
          >
            <option value={""}>----</option>
            <option value={"20"}>20%</option>
            <option value={"40"}>40%</option>
            <option value={"50"}>50%</option>
            <option value={"60"}>60%</option>
            <option value={"80"}>80%</option>
            <option value={"100"}>100%</option>
          </Select>
        </Substep>
        {states.uttaksgrad !== "" && (
          <Substep>
            <TextField
              // onChange={(it) =>
              //   setState((prev: FormValues) => ({
              //     ...prev,
              //     inntekt: it.target.value
              //   }))
              // }
              style={{ width: "10rem" }}
              label={`Hvor mange år forventer du å ha inntekt etter uttak av ${states.uttaksgrad}% pensjon?`}
            />
          </Substep>
        )}
        <Substep>
          <Select
            style={{ width: "5rem" }}
            label={
              "Hvor mange år forventer du å ha inntekt etter uttak av hel pensjon?"
            }
          >
            {Array.from({ length: 13 }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1} år
              </option>
            ))}
            <option value={"livsvarig"}>livsvarig</option>
          </Select>
        </Substep>
      </div>
    </FormWrapper>
  );
});

InntektStep.displayName = "InntektStep";
export default InntektStep;
