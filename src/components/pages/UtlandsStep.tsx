import React, {
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { Radio, RadioGroup, TextField, VStack } from "@navikt/ds-react";
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
      if (!states.boddIUtland) {
        setErrorMsg(message);
        return false;
      }

      return true;
    },
  }));

  return (
    <>
      <FormWrapper>
        <h2>Har du bodd eller arbeidet i andre land enn i Norge?</h2>
        <div>
          <RadioGroup
            legend=""
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
          <Substep>
            {states.utland === "ja" && (
              <div>
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
              </div>
            )}
          </Substep>
        </div>
      </FormWrapper>
    </>
  );
});

UtlandsStep.displayName = "UtlandsStep";
export default UtlandsStep;
