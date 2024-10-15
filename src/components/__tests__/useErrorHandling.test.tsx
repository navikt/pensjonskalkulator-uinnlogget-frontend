import React from 'react'
import { render, act } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '@/components/FormPage'
import useErrorHandling from '@/helpers/useErrorHandling'

describe('useErrorHandling', () => {
  let errorFields: { [key: string]: string | null }
  let handlers: {
    validateFields: (step: string) => boolean
    clearError: (field: string | null) => void
  }

  const renderWithState = (state: any) => {
    const TestComponent = () => {
      const result = useErrorHandling(state)
      errorFields = result[0]
      handlers = result[1]
      return null
    }

    render(
      <FormContext.Provider
        value={{
          states: state,
          setState: jest.fn(),
          formPageProps: {
            curStep: 0,
            length: 5,
            goBack: jest.fn(),
            onStepChange: jest.fn(),
            handleSubmit: jest.fn(),
            goToNext: jest.fn(),
          },
        }}
      >
        <TestComponent />
      </FormContext.Provider>
    )
  }

  describe('Riktig validering for den initielle formstaten', () => {
    beforeEach(() => {
      renderWithState(initialFormState)
    })

    test('Burde validere felt for AlderStep', () => {
      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: 'Du må oppgi et gyldig årstall',
        inntektOver1GAntallAar: 'Fyll ut antall år',
      })
    })

    test('Burde validere felt for UtlandsStep', () => {
      act(() => {
        handlers.validateFields('UtlandsStep')
      })

      expect(errorFields).toEqual({
        boddIUtland: 'Du må velge et alternativ',
        utenlandsAntallAar: null,
      })
    })

    test('Burde validere felt for InntektStep', () => {
      act(() => {
        handlers.validateFields('InntektStep')
      })

      expect(errorFields).toEqual({
        aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
        uttaksgrad: 'Du må velge uttaksgrad',
        gradertInntekt: null,
        gradertAar: null,
        gradertMaaneder: null,
        helPensjonInntekt: null,
        heltUttakAar: 'Du må velge alder',
        heltUttakMaaneder: 'Du må velge måned',
        heltUttakSluttAlderMaaneder: null,
        inntektVsaHelPensjon: 'Velg alternativ',
      })
    })

    test('Burde validere felt for EktefelleStep', () => {
      act(() => {
        handlers.validateFields('EktefelleStep')
      })

      expect(errorFields).toEqual({
        sivilstand: null,
        epsHarInntektOver2G: null,
        epsHarPensjon: null,
      })
    })

    test('Burde validere felt for AFPStep', () => {
      act(() => {
        handlers.validateFields('AFPStep')
      })

      expect(errorFields).toEqual({
        simuleringType: 'Du må velge et alternativ',
      })
    })
  })

  describe('Validering av AlderStep', () => {
    test('Burde validere gyldig årstall', () => {
      const state = { ...initialFormState, foedselAar: 1990 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: null,
        inntektOver1GAntallAar: 'Fyll ut antall år',
      })
    })

    test('Burde validere ugyldig årstall', () => {
      const state = { ...initialFormState, foedselAar: 1800 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: 'Du må oppgi et gyldig årstall',
        inntektOver1GAntallAar: 'Fyll ut antall år',
      })
    })

    test('Burde validere gyldig antall år med inntekt over 1G', () => {
      const state = { ...initialFormState, inntektOver1GAntallAar: 5 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: 'Du må oppgi et gyldig årstall',
        inntektOver1GAntallAar: null,
      })
    })

    test('Burde validere ugyldig antall år med inntekt over 1G på grunn av negativ årstall', () => {
      const state = { ...initialFormState, inntektOver1GAntallAar: -1 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: 'Du må oppgi et gyldig årstall',
        inntektOver1GAntallAar: 'Antall år kan ikke være negativt',
      })
    })

    test('Burde validere ugyldig antall år med inntekt over 1G på grunn av at årstall er mer enn 50', () => {
      const state = { ...initialFormState, inntektOver1GAntallAar: 51 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields).toEqual({
        foedselAar: 'Du må oppgi et gyldig årstall',
        inntektOver1GAntallAar: 'Du kan ikke være yrkesaktiv i mer enn 50 år',
      })
    })
  })

  describe('Validering av UtenlandsStep', () => {
    test('Burde validere riktig utfylling av bodd i utland', () => {
      const state = {
        ...initialFormState,
        boddIUtland: 'ja',
        utenlandsAntallAar: 5,
      }
      renderWithState(state)

      act(() => {
        handlers.validateFields('UtlandsStep')
      })

      expect(errorFields).toEqual({
        boddIUtland: null,
        utenlandsAntallAar: null,
      })
    })

    test('Burde validere ikke bodd i utland', () => {
      const state = { ...initialFormState, boddIUtland: 'nei' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('UtlandsStep')
      })

      expect(errorFields).toEqual({
        boddIUtland: null,
        utenlandsAntallAar: null,
      })
    })

    test('Burde validere bodd i utland uten at det er oppgitt antall år', () => {
      const state = { ...initialFormState, boddIUtland: 'ja' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('UtlandsStep')
      })

      expect(errorFields).toEqual({
        boddIUtland: null,
        utenlandsAntallAar: 'Du må fylle ut antall år',
      })
    })
  })

  describe('Riktig validering av EktefelleStep', () => {
    test('Burde validere riktig utfylling av sivilstand UGIFT', () => {
      const state = { ...initialFormState, sivilstand: 'UGIFT' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('EktefelleStep')
      })

      expect(errorFields).toEqual({
        sivilstand: null,
        epsHarInntektOver2G: null,
        epsHarPensjon: null,
      })
    })

    test('Burde validere riktig utfylling av sivilstand GIFT/SAMBOER', () => {
      const state = {
        ...initialFormState,
        sivilstand: 'GIFT',
        epsHarInntektOver2G: true,
        epsHarPensjon: false,
      }
      renderWithState(state)

      act(() => {
        handlers.validateFields('EktefelleStep')
      })

      expect(errorFields).toEqual({
        sivilstand: null,
        epsHarInntektOver2G: null,
        epsHarPensjon: null,
      })
    })

    test('Burde validere sivilstand GIFT/SAMBOER uten å ha svart på oppfølgingsspørsmål', () => {
      const state = { ...initialFormState, sivilstand: 'GIFT' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('EktefelleStep')
      })

      expect(errorFields).toEqual({
        sivilstand: null,
        epsHarInntektOver2G: 'Du må velge et alternativ',
        epsHarPensjon: 'Du må velge et alternativ',
      })
    })
  })

  describe('Validering av InntektStep', () => {
    describe('Validering for ulike varianter av gradert uttak', () => {
      //behov for flere tester her?
      test('Burde validere riktig utfylling av gradert uttak', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            uttakAlder: {
              aar: 66,
              maaneder: 0,
            },
            aarligInntektVsaPensjonBeloep: 100000,
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: null,
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          heltUttakAar: 'Du må velge alder',
          heltUttakMaaneder: 'Du må velge måned',
          inntektVsaHelPensjon: 'Velg alternativ',
          helPensjonInntekt: null,
          heltUttakSluttAlderMaaneder: null,
        })
      })

      test('Burde validere gradert uttak når kun grad er fylt inn', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            uttakAlder: {
              aar: 0,
              maaneder: -1,
            },
            aarligInntektVsaPensjonBeloep: 0,
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: null,
          gradertInntekt: 'Du må fylle ut inntekt',
          gradertAar: 'Du må velge alder',
          gradertMaaneder: 'Du må velge måned',
          heltUttakAar: 'Du må velge alder',
          heltUttakMaaneder: 'Du må velge måned',
          inntektVsaHelPensjon: 'Velg alternativ',
          helPensjonInntekt: null,
          heltUttakSluttAlderMaaneder: null,
        })
      })
    })

    describe('Validering av hel uttak', () => {
      test('Burde validere riktig utfylling av hel uttaksalder', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: {
              aar: 67,
              maaneder: 0,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          heltUttakAar: null,
          heltUttakMaaneder: null,
          inntektVsaHelPensjon: 'Velg alternativ',
          helPensjonInntekt: null,
          heltUttakSluttAlderMaaneder: null,
        })
      })

      test('Burde validere feil utfylling av hel utakksalder (år)', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: {
              aar: 0,
              maaneder: 5,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          heltUttakAar: 'Du må velge alder',
          heltUttakMaaneder: null,
          inntektVsaHelPensjon: 'Velg alternativ',
          helPensjonInntekt: null,
          heltUttakSluttAlderMaaneder: null,
        })
      })

      test('Burde validere feil utfylling av hel utakksalder (måned)', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: {
              aar: 67,
              maaneder: -1,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          heltUttakAar: null,
          heltUttakMaaneder: 'Du må velge måned',
          inntektVsaHelPensjon: 'Velg alternativ',
          helPensjonInntekt: null,
          heltUttakSluttAlderMaaneder: null,
        })
      })
    })

    describe('Validering for ulike varianter av inntekt ved siden av hel pensjon', () => {
      test('Burde validere riktig utfylling av inntekt ved siden av hel pensjon', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: {
              aar: 67,
              maaneder: 1,
            },
            aarligInntektVsaPensjon: {
              beloep: 100000,
              sluttAlder: {
                aar: 67,
                maaneder: 0,
              },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          helPensjonInntekt: null,
          heltUttakAar: null,
          heltUttakMaaneder: null,
          heltUttakSluttAlderMaaneder: null,
          inntektVsaHelPensjon: null,
        })
      })

      test('Burde validere feil utfylling av inntekt ved siden av hel pensjon', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: {
              aar: 67,
              maaneder: 1,
            },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: {
                aar: 0,
                maaneder: -1,
              },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          helPensjonInntekt: 'Du må fylle ut inntekt',
          heltUttakAar: null,
          heltUttakMaaneder: null,
          heltUttakSluttAlderMaaneder: null,
          inntektVsaHelPensjon: null,
        })
      })

      test('Burde validere feil utfylling av sluttalder for inntekt ved siden av hel pensjon', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: {
              aar: 67,
              maaneder: 1,
            },
            aarligInntektVsaPensjon: {
              beloep: 100000,
              sluttAlder: {
                aar: 70,
                maaneder: -1,
              },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields).toEqual({
          aarligInntektFoerUttakBeloep: 'Inntekt kan ikke være 0',
          uttaksgrad: 'Du må velge uttaksgrad',
          gradertInntekt: null,
          gradertAar: null,
          gradertMaaneder: null,
          helPensjonInntekt: null,
          heltUttakAar: null,
          heltUttakMaaneder: null,
          heltUttakSluttAlderMaaneder: 'Du må velge måned',
          inntektVsaHelPensjon: null,
        })
      })
    })
  })

  describe('Riktig validering av AFPStep', () => {
    test('Burde validere riktig utfylling av simuleringType', () => {
      const state = { ...initialFormState, simuleringType: 'ALDERSPENSJON' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AFPStep')
      })

      expect(errorFields).toEqual({
        simuleringType: null,
      })
    })

    test('Burde validere manglende simuleringType', () => {
      const state = { ...initialFormState, simuleringType: '' }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AFPStep')
      })

      expect(errorFields).toEqual({
        simuleringType: 'Du må velge et alternativ',
      })
    })
  })
})
