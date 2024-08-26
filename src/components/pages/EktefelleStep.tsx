import React, { forwardRef, useContext, useImperativeHandle } from "react";
import FormWrapper from "../FormWrapper";
import { Radio, RadioGroup, Select } from "@navikt/ds-react";
import { FormContext } from "@/contexts/context";
import { ContextForm, FormValues, StepRef } from "@/common";
import Substep from "../Substep";

interface FormPageProps {
  grunnbelop: number;
}

const EktefelleStep = forwardRef<StepRef, FormPageProps>(
  ({ grunnbelop }, ref) => {
    const { states, setState } = useContext(FormContext) as ContextForm;
    const [errorMsg, setErrorMsg] = React.useState<string | null>(states.sivilstand || null);
    const [selectedOption, setSelectedOption] = React.useState<string>(states.sivilstand);
    const [errorFields, setErrorFields] = React.useState({
      tredjepersonStorreEnn2G: false,
      tredjepersonMottarPensjon: false,
    });
    const message = "Du må svare på spørsmålet";

    useImperativeHandle(ref, () => ({
      onSubmit() {
        var willContinue = true;
        const errors = {
          tredjepersonStorreEnn2G: !states.tredjepersonStorreEnn2G,
          tredjepersonMottarPensjon: !states.tredjepersonMottarPensjon,
        };

        setErrorFields(errors);

        if (Object.values(errors).some((error) => error)) {
          setErrorMsg(message);
          willContinue = false;
        }

        if(states.sivilstand === "UGIFT"){
            willContinue = true;
        }

        return willContinue;
      },
    }));

    return (
      <FormWrapper>
        <Substep>
          <Select
            value={selectedOption}
            style={{ width: "5rem" }}
            label={"Hvilken uttaksgrad ønsker du?"}
            onChange={(it) => {
              setSelectedOption(it.target.value);
              setState((prev: FormValues) => ({
                ...prev,
                sivilstand: it.target.value,
              }));
            }}
          >
            <option value={"UGIFT"}>Ugift</option>
            <option value={"GIFT"}>Gift</option>
            <option value={"SAMBOER"}>Samboer</option>
          </Select>
        </Substep>
        {states.sivilstand !== "UGIFT" && (
          <>
            <Substep>
              <RadioGroup
                legend={`Har du ektefelle, partner eller samboer som har inntekt større enn ${
                  2 * grunnbelop
                }kr når du starter å ta ut pensjon?`}
                value={states.tredjepersonStorreEnn2G}
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    tredjepersonStorreEnn2G: it,
                  }))
                }
                error={errorFields.tredjepersonStorreEnn2G ? errorMsg : ""}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            </Substep>
            <Substep>
              <RadioGroup
                legend={
                  "Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?"
                }
                value={states.tredjepersonMottarPensjon}
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    tredjepersonMottarPensjon: it,
                  }))
                }
                error={errorFields.tredjepersonMottarPensjon ? errorMsg : ""}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RadioGroup>
            </Substep>
          </>
        )}
      </FormWrapper>
    );
  }
);

EktefelleStep.displayName = "EktefelleStep";
export default EktefelleStep;
