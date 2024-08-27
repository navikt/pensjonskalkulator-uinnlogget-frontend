import React, {
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { Radio, RadioGroup, ReadMore, TextField, VStack } from "@navikt/ds-react";
import FormWrapper from "../FormWrapper";
import { ContextForm, FormValues, StepRef } from "@/common";
import { FormContext } from "@/contexts/context";
import Substep from "../Substep";

const UtlandsStep = forwardRef<StepRef>((props, ref) => {
  const { states, setState } = useContext(FormContext) as ContextForm;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const message = "Venligst fyll ut hvor mange år du har bodd i utlandet";

  useImperativeHandle(ref, () => ({
    onSubmit() {
      var willContinue = true;
      
      if (!states.boddIUtland) {
        setErrorMsg(message);
        willContinue = false;
      }
      if(states.utland === "nei"){
        willContinue = true;
      }

      return willContinue;
    },
  }));

  return (
    <>
      <FormWrapper>
        <h2>Utland</h2>
        <div>
          <RadioGroup
            legend="Har du bodd eller arbeidet utenfor Norge?"
            value={states.utland || undefined}
            onChange={(it) =>
              setState((prev: FormValues) => ({
                ...prev,
                utland: it,
                boddIUtland: it == "nei" ? "" : prev.boddIUtland,
              }))
            }
          >
            <Radio value={"ja"}>Ja</Radio>
            <Radio value={"nei"}>Nei</Radio>
          </RadioGroup>
          <ReadMore header="Om opphold utenfor Norge">
            Hvis du har bodd eller arbeidet utenfor Norge, kan det påvirke
            pensjonen din. Hvis du har bodd i utlandet, kan du ha rett til
            pensjon fra det landet du har bodd i.
          </ReadMore>
          {states.utland === "ja" && (
            <Substep>
              <TextField
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    boddIUtland: it.target.value,
                  }))
                }
                type="number"
                label="Hvor mange år har du bodd i utlandet?"
                value={states.boddIUtland}
                error={errorMsg}
              ></TextField>
            </Substep>
          )}
        </div>
      </FormWrapper>
    </>
  );
});

UtlandsStep.displayName = "UtlandsStep";
export default UtlandsStep;
