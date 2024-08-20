import React, {
    forwardRef,
    Ref,
    useContext,
    useImperativeHandle,
    useState
  } from 'react'
  import { TextField, VStack } from '@navikt/ds-react'
  import FormWrapper from '../FormWrapper'
  
  import addState from '@/helpers/addState'
  import { ContextForm, StepRef } from '@/common'
  import { FormContext } from '@/contexts/context'
  
  const PensjonsalderStep = forwardRef<StepRef>((props, ref) => {
    const { states, setState } = useContext(FormContext) as ContextForm
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const message = 'Du må være mellom 62 og 75 år for å ta ut pensjon';
  
    useImperativeHandle(ref, () => ({
      onSubmit() {
        if (!states.pensjonsalder?.state) {
          setErrorMsg(message)
          return false
        }
  
        // Age must be between 62 and 75
        if (
          parseInt(states.pensjonsalder.state) < 62 ||
          parseInt(states.pensjonsalder.state) > 75
        ) {
          setErrorMsg(message)
          return false
        }
  
        return true
      }
    }))
  
    return (
      <>
        <FormWrapper>
          <h2>Når planlegger du å ta ut pensjon</h2>
          <p>
            Her skal du velge alder for når du vil starte å ta ut pensjon. 
            Du kan beregne uttak av pensjon fra du er 62 år til du er 75 år.
          </p>
          <div className='w-24'>
            <TextField
              onChange={(it) => addState(it.target.value, setState, 'pensjonsalder')}
              type='number'
              label='Pensjonsalder'
              value={states.pensjonsalder?.state || ''}
              error={errorMsg}
            ></TextField>
          </div>
        </FormWrapper>
      </>
    )
  })
  
  export default PensjonsalderStep
  