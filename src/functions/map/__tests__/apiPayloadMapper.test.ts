import { initialState } from '@/defaults/initialState'

import { produce } from 'immer'
import { mapStateToApiPayload } from '../apiPayloadMapper'

describe('Gitt at noen states behøver å oppdateres, ', () => {
  describe('Når brukeren har svart "nei" til inntekt vsa. helt uttak og beløpet er større enn 0', () => {
    test('Burde aarling inntekt vsa. pensjon settes til undefined ', async () => {
      const stateWithBeloep = produce(
        { ...initialState, harInntektVsaHelPensjon: true },
        (draft) => {
          draft.harInntektVsaHelPensjon = false
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: '1000',
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          }
        }
      )

      const expectedState = mapStateToApiPayload(stateWithBeloep)
      expect(expectedState.heltUttak.aarligInntektVsaPensjon).toBe(undefined)
    })
  })

  describe('Når brukeren har ikke fylt ut sluttalder for inntekt vsa. helt uttak, ', () => {
    test('Burde sluttalder for inntekt vsa. helt uttak nullstilles', async () => {
      const stateWithSluttAlderZero = produce(initialState, (draft) => {
        draft.heltUttak = {
          uttakAlder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjon: {
            beloep: '0',
            sluttAlder: { aar: null, maaneder: 1 },
          },
        }
      })

      const expectedState = mapStateToApiPayload(stateWithSluttAlderZero)
      expect(expectedState.heltUttak.aarligInntektVsaPensjon?.sluttAlder).toBe(
        undefined
      )
    })
  })

  test('Når grad til gradert uttak er null, Burde gradert uttak bli satt til undefined', async () => {
    const stateWithGradertUttak = produce(initialState, (draft) => {
      draft.gradertUttak = {
        grad: null,
        aarligInntektVsaPensjonBeloep: '1000',
        uttakAlder: { aar: 67, maaneder: 0 },
      }
    })

    const expectedState = mapStateToApiPayload(stateWithGradertUttak)
    expect(expectedState.gradertUttak).toBe(undefined)
  })

  test('Når brukeren har valgt sivilstand "UGIFT", Burde epsHarInntektOver2G og epsHarPensjon nullstilles', async () => {
    const stateWithSivilstandUgift = produce(initialState, (draft) => {
      draft.sivilstand = 'UGIFT'
    })

    const expectedState = mapStateToApiPayload(stateWithSivilstandUgift)
    expect(expectedState.epsHarInntektOver2G).toBe(undefined)
    expect(expectedState.epsHarPensjon).toBe(undefined)
  })
})
