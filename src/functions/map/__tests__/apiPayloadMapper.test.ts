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
            uttaksalder: { aar: 67, maaneder: 0 },
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
          uttaksalder: { aar: 67, maaneder: 0 },
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
        uttaksalder: { aar: 67, maaneder: 0 },
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

  describe('Når feltene endres fra string til number', () => {
    test('Burde aarligInntektVsaPensjonBeloep bli konvertert til number', async () => {
      const stateWithStringBeloep = produce(initialState, (draft) => {
        draft.harInntektVsaHelPensjon = true
        draft.heltUttak = {
          uttaksalder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjon: {
            beloep: '1000',
            sluttAlder: { aar: 67, maaneder: 0 },
          },
        }
      })

      const expectedState = mapStateToApiPayload(stateWithStringBeloep)
      expect(expectedState.heltUttak.aarligInntektVsaPensjon?.beloep).toBe(1000)
    })

    test('Burde aarligInntektVsaPensjon bli konvertert til 0 dersom den er undefined', async () => {
      const stateWithUndefinedBeloep = produce(initialState, (draft) => {
        draft.harInntektVsaHelPensjon = true
        draft.gradertUttak = {
          grad: 50,
          uttaksalder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjonBeloep: undefined,
        }
      })

      const expectedState = mapStateToApiPayload(stateWithUndefinedBeloep)
      expect(expectedState.heltUttak.aarligInntektVsaPensjon?.beloep).toBe(0)
    })

    test('Burde aarligInntektFoerUttakBeloep bli konvertert til number', async () => {
      const stateWithStringBeloep = produce(initialState, (draft) => {
        draft.aarligInntektFoerUttakBeloep = '1000'
      })

      const expectedState = mapStateToApiPayload(stateWithStringBeloep)
      expect(expectedState.aarligInntektFoerUttakBeloep).toBe(1000)
      expect(typeof expectedState.aarligInntektFoerUttakBeloep).toBe('number')
    })

    test('Burde aarligInntektVsaPensjonBeloep bli konvertert til number', async () => {
      const stateWithStringBeloep = produce(initialState, (draft) => {
        draft.foedselAar = '1990'
      })

      const expectedState = mapStateToApiPayload(stateWithStringBeloep)
      expect(expectedState.foedselAar).toBe(1990)
      expect(typeof expectedState.foedselAar).toBe('number')
    })

    test('Burde utenlandsAntallAar bli konvertert til number', async () => {
      const stateWithStringBeloep = produce(initialState, (draft) => {
        draft.utenlandsAntallAar = '2'
      })

      const expectedState = mapStateToApiPayload(stateWithStringBeloep)
      expect(expectedState.utenlandsAntallAar).toBe(2)
      expect(typeof expectedState.utenlandsAntallAar).toBe('number')
    })

    test('Burde inntektOver1GAntallAar bli konvertert til number', async () => {
      const stateWithStringBeloep = produce(initialState, (draft) => {
        draft.inntektOver1GAntallAar = '2'
      })

      const expectedState = mapStateToApiPayload(stateWithStringBeloep)
      expect(expectedState.inntektOver1GAntallAar).toBe(2)
      expect(typeof expectedState.inntektOver1GAntallAar).toBe('number')
    })

    test('Burde gradertUttak.aarligInntektVsaPensjonBeloep bli konvertert til number', async () => {
      const stateWithStringGradertBeloep = produce(initialState, (draft) => {
        draft.gradertUttak = {
          grad: 50,
          aarligInntektVsaPensjonBeloep: '2000',
          uttaksalder: { aar: 67, maaneder: 0 },
        }
      })

      const expectedState = mapStateToApiPayload(stateWithStringGradertBeloep)
      expect(expectedState.gradertUttak?.aarligInntektVsaPensjonBeloep).toBe(
        2000
      )
      expect(
        typeof expectedState.gradertUttak?.aarligInntektVsaPensjonBeloep
      ).toBe('number')
    })
  })
})
