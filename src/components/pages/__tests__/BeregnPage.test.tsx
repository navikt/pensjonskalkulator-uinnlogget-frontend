import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import BeregnPage from '../BeregnPage'
import { initialFormState } from '@/defaults/defaultFormState'
import { fetchBeregnData } from '../BeregnPage'
import { produce } from 'immer'
import submitForm from '@/functions/submitForm'

jest.mock('../BeregnPage', () => {
  const originalModule = jest.requireActual('../BeregnPage')
  return {
    __esModule: true,
    ...originalModule,
    fetchBeregnData: jest.fn(),
  }
})

jest.mock('@/functions/submitForm', () => jest.fn())

const mockFetchBeregnData = fetchBeregnData as jest.Mock
const mockSubmitForm = submitForm as jest.Mock

const mockBeregnResult = {
  alderspensjon: [
    { alder: 67, beloep: 200000 },
    { alder: 68, beloep: 210000 },
  ],
  afpPrivat: [
    { alder: 67, beloep: 50000 },
    { alder: 68, beloep: 55000 },
  ],
  afpOffentlig: [],
  vilkaarsproeving: {
    vilkaarErOppfylt: true,
  },
}

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  onStepChange: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: initialFormState,
  setState: mockSetState,
  formPageProps: defaultFormPageProps,
}

describe('BeregnPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSubmitForm.mockResolvedValue(JSON.stringify(mockBeregnResult))
    mockFetchBeregnData.mockImplementation(() => {
      return {
        read: () => mockSubmitForm(),
      }
    })
  })

  describe('Rendring', () => {
    test('Burde rendre Beregn komponenten', async () => {
      await act(async () => {
        render(
          <FormContext.Provider value={mockContextValue}>
            <BeregnPage />
          </FormContext.Provider>
        )
      })

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument()
      })

      const beregnElement = screen.getByText('Resultat')
      expect(beregnElement).toBeInTheDocument()
      const boxElement = screen.getByRole('region')
      expect(boxElement).toBeInTheDocument()
    })
  })

  describe('Gitt at noen states behøver å oppdateres', () => {
    test('Burde Immer sin produce funksjon kunne oppdatere statene som forventet', async () => {
      await act(async () => {
        render(
          <FormContext.Provider value={mockContextValue}>
            <BeregnPage />
          </FormContext.Provider>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Resultat')).toBeInTheDocument()
      })

      const expectedState = produce(initialFormState, (draft) => {
        draft.gradertUttak = {
          grad: 50,
          uttakAlder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjonBeloep: 50000,
        }
        draft.heltUttak = {
          uttakAlder: { aar: 68, maaneder: 0 },
          aarligInntektVsaPensjon: { beloep: 100000 },
        }
      })

      mockSetState(expectedState)
      expect(mockSetState).toHaveBeenCalledWith(expectedState)
    })

    describe('Når heltUttak behøver å oppdateres', () => {
      test('Burde heltUttak.aarligInntektVsaPensjon.beloep bli satt til 0 dersom inntektVsaHelPensjon er "nei" og beløpet er større enn 0', async () => {
        const stateWithBeloep = produce(initialFormState, (draft) => {
          draft.inntektVsaHelPensjon = 'nei'
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 1000,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          }
        })

        const expectedState = produce(stateWithBeloep, (draft) => {
          draft.heltUttak.aarligInntektVsaPensjon!.beloep = 0
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithBeloep }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })

      test('Burde heltUttak.aarligInntektVsaPensjon.sluttAlder bli satt til undefined når inntektVsaHelPensjon er "nei" og sluttAlder.aar er definert', async () => {
        const stateWithSluttAlder = produce(initialFormState, (draft) => {
          draft.inntektVsaHelPensjon = 'nei'
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          }
        })

        const expectedState = produce(stateWithSluttAlder, (draft) => {
          draft.heltUttak.aarligInntektVsaPensjon!.sluttAlder = undefined
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithSluttAlder }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })

      test('Burde heltUttak.aarligInntektVsaPensjon.sluttAlder bli satt til undefined når sluttAlder.aar er 0', async () => {
        const stateWithSluttAlderZero = produce(initialFormState, (draft) => {
          draft.heltUttak = {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: 0, maaneder: -1 },
            },
          }
        })

        const expectedState = produce(stateWithSluttAlderZero, (draft) => {
          draft.heltUttak.aarligInntektVsaPensjon!.sluttAlder = undefined
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithSluttAlderZero }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })
    })

    describe('Når gradertUttak.grad er 100', () => {
      test('Burde gradertUttak bli satt til undefined', async () => {
        const stateWithGradertUttak = produce(initialFormState, (draft) => {
          draft.gradertUttak = {
            grad: 100,
            uttakAlder: { aar: 67, maaneder: 0 },
          }
        })

        const expectedState = produce(stateWithGradertUttak, (draft) => {
          draft.gradertUttak = undefined
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithGradertUttak }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })
    })

    describe('Når sivilstand er "UGIFT"', () => {
      test('Burde epsHarInntektOver2G og epsHarPensjon bli satt til undefined', async () => {
        const stateWithSivilstandUgift = produce(initialFormState, (draft) => {
          draft.sivilstand = 'UGIFT'
        })

        const expectedState = produce(stateWithSivilstandUgift, (draft) => {
          draft.epsHarInntektOver2G = undefined
          draft.epsHarPensjon = undefined
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithSivilstandUgift }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })
    })

    describe('Når boddIUtland er "nei"', () => {
      test('Burde utenlandsAntallAar bli satt til 0', async () => {
        const stateWithBoddIUtlandNei = produce(initialFormState, (draft) => {
          draft.boddIUtland = 'nei'
        })

        const expectedState = produce(stateWithBoddIUtlandNei, (draft) => {
          draft.utenlandsAntallAar = 0
        })

        await act(async () => {
          render(
            <FormContext.Provider
              value={{ ...mockContextValue, state: stateWithBoddIUtlandNei }}
            >
              <BeregnPage />
            </FormContext.Provider>
          )
        })

        mockSetState(expectedState)
        expect(mockSetState).toHaveBeenCalledWith(expectedState)
      })
    })
  })
})
