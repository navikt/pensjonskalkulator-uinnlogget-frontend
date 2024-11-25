import { initialState } from '@/defaults/initialState'
import { transformPayload, submitForm } from '../submitForm'
import { State } from '@/common'
import { produce } from 'immer'

describe('submitForm', () => {
  const mockState: State = initialState

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Gitt at noen states behøver å oppdateres, ', () => {
    describe('Når brukeren har svart "nei" til inntekt vsa. helt uttak og beløpet er større enn 0', () => {
      test('Burde aarling inntekt vsa. pensjon settes til undefined ', async () => {
        const stateWithBeloep = produce(initialState, (draft) => {
          draft.harInntektVsaHelPensjon = false
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 1000,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          }
        })

        const expectedState = transformPayload(stateWithBeloep)
        expect(expectedState.heltUttak.aarligInntektVsaPensjon?.beloep).toBe(
          undefined
        )
      })
    })

    describe('Når brukeren har ikke fylt ut sluttalder for inntekt vsa. helt uttak, ', () => {
      test('Burde sluttalder for inntekt vsa. helt uttak nullstilles', async () => {
        const stateWithSluttAlderZero = produce(initialState, (draft) => {
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: null, maaneder: 1 },
            },
          }
        })

        const expectedState = transformPayload(stateWithSluttAlderZero)
        expect(
          expectedState.heltUttak.aarligInntektVsaPensjon?.sluttAlder
        ).toBe(undefined)
      })
    })

    test('Når grad til gradert uttak er null, Burde gradert uttak bli satt til undefined', async () => {
      const stateWithGradertUttak = produce(initialState, (draft) => {
        draft.gradertUttak = {
          grad: null,
          aarligInntektVsaPensjonBeloep: 1000,
          uttakAlder: { aar: 67, maaneder: 0 },
        }
      })

      const expectedState = transformPayload(stateWithGradertUttak)
      expect(expectedState.gradertUttak).toBe(undefined)
    })

    test('Når brukeren har valgt sivilstand "UGIFT", Burde epsHarInntektOver2G og epsHarPensjon nullstilles', async () => {
      const stateWithSivilstandUgift = produce(initialState, (draft) => {
        draft.sivilstand = 'UGIFT'
      })

      const expectedState = transformPayload(stateWithSivilstandUgift)
      expect(expectedState.epsHarInntektOver2G).toBe(undefined)
      expect(expectedState.epsHarPensjon).toBe(undefined)
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
        expect(rejectedPromise).toBe('Unhandled error')
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
