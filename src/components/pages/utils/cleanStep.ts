export const cleanStep = (step: string) => {
  return step.replaceAll(' ', '-').replace(/[()]/g, '')
}
