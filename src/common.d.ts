export type FormValues = {
  alder: string
  inntekt: string
  aarYrkesaktiv: string
  alderTaUt: string
  uttaksgrad: string
  forventetInntektEtterUttak: string
  utland: string
  boddIUtland: string
  AntallAarBoddINorge: string
  rettTilAfp: string
  tredjepersonStorreEnn2G: string
  tredjepersonMottarPensjon: string
}

export interface ContextForm {
  states: FormValues
  setState: Dispatch<React.SetStateAction<FormValues>>
}

export interface StepRef {
  onSubmit: () => void
}
