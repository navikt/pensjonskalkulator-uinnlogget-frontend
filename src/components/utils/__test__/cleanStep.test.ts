import { cleanStep } from '../cleanStep'

describe('cleanStep function', () => {
  test('Burde erstatte mellomrom med bindestreker', () => {
    const result = cleanStep('test step')
    expect(result).toBe('test-step')
  })

  test('Burde fjerne parenteser', () => {
    const result = cleanStep('test(step)')
    expect(result).toBe('teststep')
  })

  test('Burde erstatte mellomrom med bindestreker og fjerne parenteser', () => {
    const result = cleanStep('test (step)')
    expect(result).toBe('test-step')
  })

  test('Burde returnere tom streng når input er tom', () => {
    const result = cleanStep('')
    expect(result).toBe('')
  })

  test('Burde håndtere strenger uten mellomrom eller parenteser', () => {
    const result = cleanStep('teststep')
    expect(result).toBe('teststep')
  })
})
