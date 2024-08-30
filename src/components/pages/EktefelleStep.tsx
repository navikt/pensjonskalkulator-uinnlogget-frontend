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
      epsHarInntektOver2G: false,
      epsHarPensjon: false,
    });
    const message = "Du må svare på spørsmålet";

    useImperativeHandle(ref, () => ({
      onSubmit() {
        var willContinue = true;
        const errors = {
          epsHarInntektOver2G: !states.epsHarInntektOver2G,
          epsHarPensjon: !states.epsHarPensjon,
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
            label={"Hva er din sivilstand?"}
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
                value={states.epsHarInntektOver2G}
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    epsHarInntektOver2G: it,
                  }))
                }
                error={errorFields.epsHarInntektOver2G ? errorMsg : ""}
              >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nei</Radio>
              </RadioGroup>
            </Substep>
            <Substep>
              <RadioGroup
                legend={
                  "Har du ektefelle, partner eller samboer som mottar pensjon eller uføretrygd fra folketrygden eller AFP når du starter å ta ut pensjon?"
                }
                value={states.epsHarPensjon}
                onChange={(it) =>
                  setState((prev: FormValues) => ({
                    ...prev,
                    epsHarPensjon: it,
                  }))
                }
                error={errorFields.epsHarPensjon ? errorMsg : ""}
              >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nei</Radio>
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
