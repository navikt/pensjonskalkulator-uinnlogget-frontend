import { submitForm } from '../submitForm'
import { initialState } from '@/defaults/initialState'
import { SimuleringError, State } from '@/common'

describe('submitForm', () => {
  const mockState: State = initialState

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Gitt at API-kallet gir response.status 409', () => {
    it('Burde kaste en SimuleringError', async () => {
      const mockError: SimuleringError = {
        status: 'PEK100',
        message: 'En feilmelding',
      }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        status: 409,
        json: jest.fn().mockResolvedValue(JSON.stringify(mockError)),
      })

      try {
        await submitForm(mockState)
      } catch (rejectedPromise) {
        await rejectedPromise
        expect(rejectedPromise).toEqual(mockError)
      }
    })
  })

  describe('Gitt at API-kallet gir response.ok', () => {
    it('Burde riktig response bli returnert', async () => {
      const mockResponse = { data: 'success' }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      })

      const returnedValue = await submitForm(mockState)
      expect(returnedValue).toEqual(mockResponse)
    })

    it('Burde en feil bli kastet dersom responsen er undefined', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(undefined),
      })

      try {
        await submitForm(mockState)
      } catch (rejectedPromise) {
        await rejectedPromise
        expect(rejectedPromise).toBe('Error parsing JSON')
      }
    })
  })

  describe('Gitt at API-kallet ikke gir response.ok', () => {
    it('Når fetching returnerer feil, returnerer ...', async () => {
      const mockResponse = { data: 'error' }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      })

      try {
        await submitForm(mockState)
      } catch (rejectedPromise) {
        await rejectedPromise
        expect(rejectedPromise).toBe('Unhandled error')
      }
    })
  })
})
