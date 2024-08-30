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
import { stat } from "fs";

const InntektStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm;
  const [inntektVsaHelPensjon, setInntektVsaHelPensjon] = useState("");
  const [livsvarigInntekt, setLivsvarigInntekt] = useState(true);
  const [errorFields, setErrorFields] = React.useState({
    aarligInntektFoerUttakBeloep: false,
    uttaksgrad: false,
    gradertInntekt: false,
    helPensjonInntekt: false,
    gradertAar: false,
    gradertMaaneder: false,
    heltUttakAar: false,
    heltUttakMaaneder: false,
  });
  const [errorMsgInntekt, setErrorMsgInntekt] = useState<string | null>(null);
  const [errorMsgUttaksgrad, setErrorMsgUttaksgrad] = useState<string | null>(null);
  const [errorMsgGradInntekt, setErrorMsgGradInntekt] = useState<string | null>(null);
  const [errorMsgGradAar, setErrorMsgGradAar] = useState<string | null>(null);
  const [errorMsgGradMaaneder, setErrorMsgGradMaaneder] = useState<string | null>(null);
  const [errorMsgHelPensjonInntekt, setErrorMsgHelPensjonInntekt] = useState<string | null>(null);
  const [errorMsgHeltUttakAar, setErrorMsgHeltUttakAar] = useState<string | null>(null);
  const [errorMsgHeltUttakMaaneder, setErrorMsgHeltUttakMaaneder] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    onSubmit() {
      var willContinue = true;

      const errors = {
        aarligInntektFoerUttakBeloep: !states.aarligInntektFoerUttakBeloep || states.aarligInntektFoerUttakBeloep < 0,
        uttaksgrad: !states.gradertUttak.grad,
        gradertInntekt: !states.gradertUttak.aarligInntektVsaPensjonBeloep || states.gradertUttak.aarligInntektVsaPensjonBeloep < 0,
        helPensjonInntekt: !states.heltUttak.aarligInntektVsaPensjon.beloep || states.heltUttak.aarligInntektVsaPensjon.beloep < 0,
        gradertAar: states.gradertUttak.uttakAlder.aar === null || states.gradertUttak.uttakAlder.aar === -1,
        gradertMaaneder: states.gradertUttak.uttakAlder.maaneder === null || states.gradertUttak.uttakAlder.maaneder === -1,
        heltUttakAar: !states.heltUttak.uttakAlder.aar || states.heltUttak.uttakAlder.aar === -1,
        heltUttakMaaneder: states.heltUttak.uttakAlder.maaneder === null || states.heltUttak.uttakAlder.maaneder === -1,
      };

      setErrorFields(errors);
      console.log(states.heltUttak.uttakAlder.maaneder);

      if (Object.values(errors).some((error) => error)) {
        if (!states.aarligInntektFoerUttakBeloep) {
          setErrorMsgInntekt("Du må fylle ut inntekt");
        }

        if (states.aarligInntektFoerUttakBeloep < 0) {
          setErrorMsgInntekt("Inntekt kan ikke være negativ");
        }

        if(!states.gradertUttak.grad){
          setErrorMsgUttaksgrad("Du må velge uttaksgrad");
        }

        if(states.gradertUttak.grad > 0 && states.gradertUttak.grad !== 100){
          if(!states.gradertUttak.aarligInntektVsaPensjonBeloep){
            setErrorMsgGradInntekt("Du må fylle ut inntekt");
          }
          if(states.gradertUttak.aarligInntektVsaPensjonBeloep < 0){
            setErrorMsgGradInntekt("Inntekt kan ikke være negativ");
          }
          if(states.gradertUttak.uttakAlder.aar === null || states.gradertUttak.uttakAlder.aar === -1){
            setErrorMsgGradAar("Du må velge alder");
          }
          if(states.gradertUttak.uttakAlder.maaneder === null || states.gradertUttak.uttakAlder.maaneder === -1){
            setErrorMsgGradMaaneder("Du må velge måned");
          }
        } 

        if(!states.heltUttak.uttakAlder.aar || states.heltUttak.uttakAlder.aar === -1){
          setErrorMsgHeltUttakAar("Du må velge alder");
        }
        if(states.heltUttak.uttakAlder.maaneder === null || states.heltUttak.uttakAlder.maaneder === -1){
          setErrorMsgHeltUttakMaaneder("Du må velge måned");
        }

        if(inntektVsaHelPensjon === "ja"){
          if(!states.heltUttak.aarligInntektVsaPensjon.beloep){
            setErrorMsgHelPensjonInntekt("Du må fylle ut inntekt");
          }
          if(states.heltUttak.aarligInntektVsaPensjon.beloep < 0){
            setErrorMsgHelPensjonInntekt("Inntekt kan ikke være negativ");
          }
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
              aarligInntektFoerUttakBeloep: parseInt(it.target.value),
            }))
          }
          label="Hva er din forventede årlige inntekt?"
          description="Dagens kroneverdi før skatt"
          value={states.aarligInntektFoerUttakBeloep === 0 ? "" : states.aarligInntektFoerUttakBeloep}
          error={
            errorFields.aarligInntektFoerUttakBeloep ? errorMsgInntekt : ""
          }
        />
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
            value={states.gradertUttak.grad}
            style={{ width: "5rem" }}
            label={"Hvilken uttaksgrad ønsker du?"}
            onChange={(it) => {
              setState((prev: FormValues) => ({
                ...prev,
                gradertUttak: (prev.gradertUttak = {
                  ...prev.gradertUttak,
                  grad: parseInt(it.target.value),
                }),
              }));
            }}
            error={errorFields.uttaksgrad ? errorMsgUttaksgrad : ""}
          >
            <option value={"0"}>----</option>
            <option value={"20"}>20%</option>
            <option value={"40"}>40%</option>
            <option value={"50"}>50%</option>
            <option value={"60"}>60%</option>
            <option value={"80"}>80%</option>
            <option value={"100"}>100%</option>
          </Select>
        </Substep>
        {states.gradertUttak.grad !== 0 && states.gradertUttak.grad !== 100 && (
          <>
            <Substep>
              <div className="flex space-x-4">
                <Select
                  value={states.gradertUttak.uttakAlder.aar?? -1}
                  style={{ width: "5rem" }}
                  label={`Når planlegger du å ta ut ${states.gradertUttak.grad}% pensjon?`}
                  description="Velg alder"
                  onChange={(it) => {
                    setState((prev: FormValues) => ({
                      ...prev,
                      gradertUttak: {
                        ...prev.gradertUttak,
                        uttakAlder: {
                          aar: parseInt(it.target.value),
                          maaneder: prev.gradertUttak.uttakAlder.maaneder,
                        },
                      },
                    }));
                  }}
                  error={errorFields.gradertAar ? errorMsgGradAar : ""}
                >
                  <option value={-1}>----</option>
                  {Array.from({ length: 14 }, (_, i) => (
                    <option value={i + 62} key={i}>
                      {i + 62} år
                    </option>
                  ))}
                </Select>

                <Select
                  value={states.gradertUttak.uttakAlder.maaneder?? -1}
                  style={{ width: "5rem" }}
                  label={"Velg måned"}
                  onChange={(it) => {
                    setState((prev: FormValues) => ({
                      ...prev,
                      gradertUttak: (prev.gradertUttak = {
                        ...prev.gradertUttak,
                        uttakAlder: {
                          aar: prev.gradertUttak.uttakAlder.aar,
                          maaneder: parseInt(it.target.value),
                        },
                      }),
                    }));
                  }}
                  error={errorFields.gradertMaaneder ? errorMsgGradMaaneder : ""}
                >
                  <option value={-1}>----</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option value={i} key={i}>
                      {i + 1}.mnd
                    </option>
                  ))}
                </Select>
              </div>
            </Substep>

            <Substep>
              <TextField
                onChange={(it) => {
                  setState((prev: FormValues) => ({
                    ...prev,
                    gradertUttak: {
                      ...prev.gradertUttak,
                      aarligInntektVsaPensjonBeloep: parseInt(it.target.value),
                    },
                  }));
                }}
                style={{ width: "10rem" }}
                label={`Hva forventer du å ha i årlig inntekt samtidig som du tar ${states.gradertUttak.grad}% pensjon?`}
                value={states.gradertUttak.aarligInntektVsaPensjonBeloep === 0 ? "" : states.gradertUttak.aarligInntektVsaPensjonBeloep}
                error={errorFields.gradertInntekt ? errorMsgGradInntekt : ""}
              />
            </Substep>
          </>
        )}
        <Substep>
          <div className="flex space-x-4">
            <Select
              value={states.heltUttak.uttakAlder.aar}
              style={{ width: "5rem" }}
              label={`Når planlegger du å ta ut 100% pensjon?`}
              description="Velg alder"
              onChange={(it) => {
                setState((prev: FormValues) => ({
                  ...prev,
                  heltUttak: {
                    ...prev.heltUttak,
                    uttakAlder: {
                      aar: parseInt(it.target.value),
                      maaneder: prev.gradertUttak.uttakAlder.maaneder,
                    },
                  },
                }));
              }}
              error={errorFields.heltUttakAar ? errorMsgHeltUttakAar : ""}
            >
              <option value={-1}>----</option>
              {Array.from({ length: 14 }, (_, i) => (
                <option value={i + 62} key={i}>
                  {i + 62} år
                </option>
              ))}
            </Select>

            <Select
              value={states.heltUttak.uttakAlder.maaneder}
              style={{ width: "5rem" }}
              label={"Velg måned"}
              onChange={(it) => {
                setState((prev: FormValues) => ({
                  ...prev,
                  heltUttak: (prev.heltUttak = {
                    ...prev.heltUttak,
                    uttakAlder: {
                      aar: prev.heltUttak.uttakAlder.aar,
                      maaneder: parseInt(it.target.value),
                    },
                  }),
                }));
              }}
              error={errorFields.heltUttakMaaneder ? errorMsgHeltUttakMaaneder : ""}
            >
              <option value={-1}>----</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option value={i} key={i}>
                  {i + 1}.mnd
                </option>
              ))}
            </Select>
          </div>
        </Substep>
        <RadioGroup
          legend="Forventer du å ha inntekt etter uttak av hel pensjon?"
          value={inntektVsaHelPensjon}
          onChange={(it) => setInntektVsaHelPensjon(it)}
        >
          <Radio value={"ja"}>Ja</Radio>
          <Radio value={"nei"}>Nei</Radio>
        </RadioGroup>
        {inntektVsaHelPensjon === "ja" && (
          <>
            <Substep>
              <TextField
                label="Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?"
                value={states.heltUttak.aarligInntektVsaPensjon.beloep === 0 ? "" : states.heltUttak.aarligInntektVsaPensjon.beloep}
                onChange={(it) => {
                  setState((prev: FormValues) => ({
                    ...prev,
                    heltUttak: {
                      ...prev.heltUttak,
                      aarligInntektVsaPensjon: {
                        ...prev.heltUttak.aarligInntektVsaPensjon,
                        beloep: parseInt(it.target.value),
                      },
                    },
                  }));
                }}
                error={errorFields.helPensjonInntekt ? errorMsgHelPensjonInntekt : ""}
              />
            </Substep>

            <Substep>
              <div className="flex space-x-4">
                <Select
                  value={
                    states.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar ??
                    "livsvarig"
                  }
                  style={{ width: "5rem" }}
                  label={"Til hvilken alder forventer du å ha inntekten?"}
                  description="Velg alder"
                  onChange={(it) => {
                    const value = it.target.value;
                    setLivsvarigInntekt(value === "livsvarig" ? true : false);
                    setState((prev: FormValues) => ({
                      ...prev,
                      heltUttak: {
                        ...prev.heltUttak,
                        aarligInntektVsaPensjon: {
                          ...prev.heltUttak.aarligInntektVsaPensjon,
                          sluttAlder: {
                            ...prev.heltUttak.aarligInntektVsaPensjon
                              .sluttAlder,
                            aar: value === "livsvarig" ? null : value,
                            maaneder:
                              prev.heltUttak.aarligInntektVsaPensjon.sluttAlder
                                .maaneder,
                          },
                        },
                      },
                    }));
                  }}
                  /* error={errorFields.alderTaUt ? errorMsgTaUt : ""} */
                >
                  <option value={"livsvarig"}>Livsvarig</option>
                  {Array.from({ length: 14 }, (_, i) => (
                    <option value={i + 62} key={i}>
                      {i + 62} år
                    </option>
                  ))}
                </Select>
                {!livsvarigInntekt && (
                  <Select
                    value={
                      states.heltUttak.aarligInntektVsaPensjon.sluttAlder
                        .maaneder ?? "livsvarig"
                    }
                    style={{ width: "5rem" }}
                    label={"Velg måned"}
                    onChange={(it) => {
                      const value = it.target.value;
                      setState((prev: FormValues) => ({
                        ...prev,
                        heltUttak: {
                          ...prev.heltUttak,
                          aarligInntektVsaPensjon: {
                            ...prev.heltUttak.aarligInntektVsaPensjon,
                            sluttAlder: {
                              ...prev.heltUttak.aarligInntektVsaPensjon
                                .sluttAlder,
                              aar: prev.heltUttak.aarligInntektVsaPensjon
                                .sluttAlder.aar,
                              maaneder: value === "livsvarig" ? null : value,
                            },
                          },
                        },
                      }));
                    }}
                    /* error={errorFields.alderTaUt ? errorMsgTaUt : ""} */
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option value={i} key={i}>
                        {i + 1}.mnd
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            </Substep>
          </>
        )}
      </div>
    </FormWrapper>
  );
});

InntektStep.displayName = "InntektStep";
export default InntektStep;
