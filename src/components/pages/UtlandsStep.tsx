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
  const [boddIUtland, setBoddIUtland] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    onSubmit() {
      var willContinue = true;
      
      if (states.utenlandsAntallAar === 0 && boddIUtland === "ja") {
        setErrorMsg("Venligst fyll ut hvor mange år du har bodd i utlandet");
        willContinue = false;
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
            value={boddIUtland}
            onChange={(it) =>
              setBoddIUtland(it)
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
          {boddIUtland === "ja" && (
            <Substep>
              <TextField
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    utenlandsAntallAar: parseInt(it.target.value),
                  }))
                }
                type="number"
                label="Hvor mange år har du bodd i utlandet?"
                value={states.utenlandsAntallAar?? 0}
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
