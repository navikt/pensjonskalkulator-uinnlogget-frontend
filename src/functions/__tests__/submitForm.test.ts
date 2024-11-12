import { initialFormState } from '@/defaults/defaultFormState'
import submitForm from '../submitForm'
import { State } from '@/common'

describe('submitForm', () => {
  const mockState: State = initialFormState

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Gitt at API-kallet gir response.ok', () => {
    it('Burde riktig response bli returnert', async () => {
      const mockResponse = { data: 'success' }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      })

      const form = submitForm(mockState)

      // Ensure the promise is properly awaited
      try {
        form.read()
      } catch (suspender) {
        await suspender
      }

      // Wait for the promise to resolve
      await new Promise(process.nextTick)

      // Read the result after the promise has resolved
      const result = form.read()
      expect(result).toEqual(mockResponse)
    })

    it('Burde en feil bli kastet dersom responsen er undefined', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(undefined),
      })

      const form = submitForm(mockState)

      try {
        form.read()
      } catch (suspender) {
        await suspender
      }

      await new Promise(process.nextTick)

      expect(() => form.read()).toThrow('Result is undefined')
    })
  })

  describe('Gitt at API-kallet ikke har ok response', () => {
    it('Burde API-feil bli håndtert med riktig status og melding', async () => {
      const mockError = { message: 'API Error', status: 400 }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(mockError),
      })

      const form = submitForm(mockState)

      try {
        form.read()
      } catch (suspender) {
        await suspender
      }

      await new Promise(process.nextTick)

      try {
        form.read()
      } catch (error) {
        const typedError = error as { message: string; status: number }
        expect(typedError.message).toBe(mockError.message)
        expect(typedError.status).toBe(mockError.status)
      }
    })

    it('Burde en standardmelding bli kastet dersom feilen ikke innehar en melding', async () => {
      const mockError = { status: 400 } // Ingen message-egenskap
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(mockError),
      })

      const form = submitForm(mockState)

      // Sørg for at løftet blir riktig ventet på
      try {
        form.read()
      } catch (suspender) {
        await suspender
      }

      await new Promise(process.nextTick) // Vent til løftet er løst

      // Les resultatet etter at løftet er løst
      try {
        form.read()
      } catch (error) {
        const typedError = error as { message: string; status: number }
        expect(typedError.message).toBe('Failed to submit form')
      }
    })
    it('Burde innsending av skjema med nettverksfeil bli håndtert', async () => {
      const mockError = new Error('Network Error')
      ;(global.fetch as jest.Mock).mockRejectedValue(mockError)

      const form = submitForm(mockState)

      try {
        form.read()
      } catch (suspender) {
        await suspender
      }

      await new Promise(process.nextTick)

      expect(() => form.read()).toThrow(mockError.message)
    })
  })
  describe('Gitt at en promise er "pending"', () => {
    it('Burde en suspender bli kastet', async () => {
      const mockPromise = new Promise(() => {})
      ;(global.fetch as jest.Mock).mockReturnValue(mockPromise)

      const form = submitForm(mockState)
      try {
        form.read()
      } catch (error) {
        expect(error).toStrictEqual(mockPromise)
      }
    })
  })
})
