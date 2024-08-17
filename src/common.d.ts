export type Values = {
  [key: string]: { state: string }
}

export interface ContextForm {
  states: Values
  setState: Dispatch<React.SetStateAction<Values>>
}
