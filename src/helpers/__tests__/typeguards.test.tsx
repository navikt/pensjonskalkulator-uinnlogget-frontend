import { isSimuleringError } from '../typeguards'
import { SimuleringError } from '@/common'

describe('isSimuleringError funksjon', () => {
  test('Burde returnere true for et gyldig SimuleringError objekt', () => {
    const error: SimuleringError = {
      status: 'PEK100',
      message: 'En feilmelding',
    }
    expect(isSimuleringError(error)).toBe(true)
  })

  test('Burde returnere false for et objekt som ikke er et SimuleringError objekt', () => {
    const error = {
      status: 'PEK100',
      merknader: ['En merknad'],
    }
    expect(isSimuleringError(error)).toBe(false)
  })
})
