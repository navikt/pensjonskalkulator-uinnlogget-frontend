export const cleanStep = (step: string) => {
  return step.replaceAll(' ', '-').replaceAll(/[()]/g, '')
}
