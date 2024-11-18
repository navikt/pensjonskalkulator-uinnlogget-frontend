import React from 'react'
import { render, act } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import { initialFormState } from '@/defaults/defaultFormState'
import useErrorHandling from '@/helpers/useErrorHandling'
import { State } from '@/common'

describe('useErrorHandling', () => {
  let errorFields: { [key: string]: string }
  let handlers: {
    validateFields: (
      step:
        | 'AlderStep'
        | 'UtlandsStep'
        | 'InntektStep'
        | 'EktefelleStep'
        | 'AFPStep'
    ) => boolean
    clearError: (field: string) => void
  }

  const renderWithState = (state: State) => {
    const TestComponent = () => {
      const result = useErrorHandling(state)
      errorFields = result[0]
      handlers = result[1]
      return null
    }

    render(
      <FormContext.Provider
        value={{
          state: state,
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

  describe('Validering for AlderStep', () => {
    describe('foedselAar', () => {
      test('Skal validere at foedselAar ikke er mindre enn 1900', () => {
        const state = { ...initialFormState, foedselAar: 1800 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')
      })

      test('Skal validere at foedselAar ikke er etter dagens dato', () => {
        const state = {
          ...initialFormState,
          foedselAar: new Date().getFullYear() + 1,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')
      })

      test('Skal ikke gi feil ved gyldig foedselAar', () => {
        const state = { ...initialFormState, foedselAar: 1990 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('')
      })
    })

    describe('inntektOver1GAntallAar', () => {
      test('Skal gi feilmelding når antall år er undefined', () => {
        const state = { ...initialFormState, inntektOver1GAntallAar: undefined }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe('Fyll ut antall år')
      })

      test('Skal gi feilmelding når antall år er -1', () => {
        const state = { ...initialFormState, inntektOver1GAntallAar: -1 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe('Fyll ut antall år')
      })

      test('Skal gi feilmelding når antall år er negativt', () => {
        const state = { ...initialFormState, inntektOver1GAntallAar: -10 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Antall år kan ikke være negativt'
        )
      })

      test('Skal gi feilmelding når antall år overstiger 50', () => {
        const state = { ...initialFormState, inntektOver1GAntallAar: 51 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Du kan ikke være yrkesaktiv i mer enn 50 år'
        )
      })

      test('Skal ikke gi feilmelding ved gyldig antall år', () => {
        const state = { ...initialFormState, inntektOver1GAntallAar: 25 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe('')
      })
    })
  })

  describe('Validering for UtlandsStep', () => {
    describe('boddIUtland', () => {
      test('Skal gi feilmelding når boddIUtland ikke er valgt', () => {
        const state = { ...initialFormState, boddIUtland: '' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('UtlandsStep')
        })

        expect(errorFields.boddIUtland).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når boddIUtland er valgt', () => {
        const state = { ...initialFormState, boddIUtland: 'ja' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('UtlandsStep')
        })

        expect(errorFields.boddIUtland).toBe('')
      })
    })

    describe('utenlandsAntallAar', () => {
      describe('Når boddIUtland er nei', () => {
        test('Skal ikke gi feilmelding når utenlandsAntallAar er undefined', () => {
          const state = {
            ...initialFormState,
            boddIUtland: 'nei',
            utenlandsAntallAar: undefined,
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe('')
        })
        test('Skal ikke gi feilmelding når utenlandsAntallAar er 0', () => {
          const state = {
            ...initialFormState,
            boddIUtland: 'nei',
            utenlandsAntallAar: 0,
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe('')
        })
      })
      describe('Når boddIUtland er ja', () => {
        test('Skal gi feilmelding når utenlandsAntallAar er 0', () => {
          const state = {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: 0,
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe(
            'Du må fylle ut antall år'
          )
        })

        test('Skal gi feilmelding når utenlandsAntallAar er negativt', () => {
          const state = {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: -1,
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe(
            'Antall år må være positiv'
          )
        })

        test('Skal ikke gi feilmelding når utenlandsAntallAar er gyldig', () => {
          const state = {
            ...initialFormState,
            boddIUtland: 'ja',
            utenlandsAntallAar: 5,
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe('')
        })
      })
    })
  })

  describe('Validering for InntektStep', () => {
    describe('aarligInntektFoerUttakBeloep', () => {
      test('Skal gi feilmelding når inntekt er undefined', () => {
        const state = {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Du må fylle ut inntekt'
        )
      })

      test('Skal gi feilmelding når inntekt er 0', () => {
        const state = { ...initialFormState, aarligInntektFoerUttakBeloep: 0 }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Inntekt kan ikke være 0'
        )
      })

      test('Skal gi feilmelding når inntekt er negativ', () => {
        const state = {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: -1000,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Inntekt kan ikke være negativ'
        )
      })

      test('Skal ikke gi feilmelding når inntekt er gyldig', () => {
        const state = {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: 500000,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe('')
      })
    })

    describe('uttaksgrad', () => {
      test('Skal gi feilmelding når uttaksgrad er 0', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 0,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.uttaksgrad).toBe('Du må velge uttaksgrad')
      })

      test('Skal ikke gi feilmelding når uttaksgrad er gyldig', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.uttaksgrad).toBe('')
      })
    })

    describe('gradertInntekt', () => {
      test('Skal gi feilmelding når gradert uttak har gyldig grad, men inntekt er ikke utfylt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe('Du må fylle ut inntekt')
      })

      test('Skal gi feilmelding når gradert uttak har gyldig grad, men inntekt er negativ', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: -1000,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe('Inntekt kan ikke være negativ')
      })

      test('Skal ikke gi feilmelding når gradert uttak har gyldig grad og inntekt er utfylt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 300000,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe('')
      })
    })

    describe('gradertAar', () => {
      test('Skal gi feilmelding når gradert uttak har gyldig grad', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertAar).toBe('Du må velge alder')
      })

      test('Skal ikke gi feilmelding når gradert uttak har gyldig grad og alder er valgt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 67, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertAar).toBe('')
      })

      test('Skal ikke gi feilmelding når grad er 100 og uttaksår ikke er valgt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 100,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertAar).toBe('')
      })
    })

    describe('gradertMaaneder', () => {
      test('Skal gi feilmelding når gradert uttak har gyldig grad', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertMaaneder).toBe('Du må velge måned')
      })

      test('Skal ikke gi feilmelding når gradert uttak har gyldig grad og måned er valgt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertMaaneder).toBe('')
      })

      test('Skal ikke gi feilmelding når grad er 100 og uttaksmåned ikke er valgt', () => {
        const state = {
          ...initialFormState,
          gradertUttak: {
            grad: 100,
            aarligInntektVsaPensjonBeloep: 0,
            uttakAlder: { aar: 0, maaneder: -1 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertAar).toBe('')
      })
    })

    describe('heltUttakAar', () => {
      test('Skal gi feilmelding når heltUttakAar er 0', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakAar).toBe('Du må velge alder')
      })

      test('Skal ikke gi feilmelding når heltUttakAar er gyldig', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakAar).toBe('')
      })
    })

    describe('heltUttakMaaneder', () => {
      test('Skal gi feilmelding når heltUttakMaaneder er -1', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakMaaneder).toBe('Du må velge måned')
      })

      test('Skal ikke gi feilmelding når heltUttakMaaneder er gyldig', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: { beloep: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakMaaneder).toBe('')
      })
    })

    describe('helPensjonInntekt', () => {
      test('Skal gi feilmelding når hel pensjon er valgt, men inntekt er ikke utfylt', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe('Du må fylle ut inntekt')
      })

      test('Skal gi feilmelding når hel pensjon er valgt, men inntekt er negativ', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: -5000 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe(
          'Inntekt kan ikke være negativ'
        )
      })

      test('Skal ikke gi feilmelding når hel pensjon er valgt og inntekt er utfylt', () => {
        const state = {
          ...initialFormState,
          inntektVsaHelPensjon: 'ja',
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: { beloep: 200000 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe('')
      })
    })

    describe('heltUttakSluttAlderMaaneder', () => {
      test('Skal gi feilmelding når måned i sluttalder ikke er satt', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: 67, maaneder: -1 },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakSluttAlderMaaneder).toBe(
          'Du må velge måned'
        )
      })

      test('Skal ikke gi feilmelding når måned i sluttalder er satt', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakSluttAlderMaaneder).toBe('')
      })

      test('Skal ikke gi feilmelding dersom sluttalder ikke er satt (livsvarig inntekt ved siden av pensjon)', () => {
        const state = {
          ...initialFormState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: 0,
              sluttAlder: { aar: 0, maaneder: -1 },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakSluttAlderMaaneder).toBe('')
      })
    })

    describe('inntektVsaHelPensjon', () => {
      test('Skal gi feilmelding når brukeren ikke har valgt om de har inntekt ved hel pensjon', () => {
        const state = { ...initialFormState, inntektVsaHelPensjon: '' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.inntektVsaHelPensjon).toBe('Velg alternativ')
      })

      test('Skal ikke gi feilmelding når brukeren har valgt om de har inntekt ved hel pensjon', () => {
        const state = { ...initialFormState, inntektVsaHelPensjon: 'nei' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.inntektVsaHelPensjon).toBe('')
      })
    })
  })

  describe('Validering for EktefelleStep', () => {
    describe('sivilstand', () => {
      test('Skal gi feilmelding når sivilstand ikke er satt', () => {
        const state = {
          ...initialFormState,
          sivilstand: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.sivilstand).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når sivilstand er valgt', () => {
        const state = {
          ...initialFormState,
          sivilstand: 'UGIFT',
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.sivilstand).toBe('')
      })
    })

    describe('epsHarInntektOver2G', () => {
      test('Skal gi feilmelding når epsHarInntektOver2G ikke er valgt', () => {
        const state = {
          ...initialFormState,
          sivilstand: 'GIFT',
          epsHarInntektOver2G: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.epsHarInntektOver2G).toBe(
          'Du må velge et alternativ'
        )
      })

      test('Skal ikke gi feilmelding når epsHarInntektOver2G er valgt', () => {
        const state = {
          ...initialFormState,
          sivilstand: 'GIFT',
          epsHarInntektOver2G: true,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.epsHarInntektOver2G).toBe('')
      })
    })

    describe('epsHarPensjon', () => {
      test('Skal gi feilmelding når epsHarPensjon ikke er valgt', () => {
        const state = {
          ...initialFormState,
          sivilstand: 'GIFT',
          epsHarPensjon: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.epsHarPensjon).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når epsHarPensjon er valgt', () => {
        const state = {
          ...initialFormState,
          sivilstand: 'GIFT',
          epsHarPensjon: false,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('EktefelleStep')
        })

        expect(errorFields.epsHarPensjon).toBe('')
      })
    })
  })

  describe('Validering for AFPStep', () => {
    describe('simuleringType', () => {
      test('Skal gi feilmelding når simuleringType ikke er valgt', () => {
        const state = { ...initialFormState, simuleringType: undefined }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AFPStep')
        })

        expect(errorFields.simuleringType).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når simuleringType er valgt', () => {
        const state = { ...initialFormState, simuleringType: 'ALDERSPENSJON' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AFPStep')
        })

        expect(errorFields.simuleringType).toBe('')
      })
    })
  })

  describe('clearError', () => {
    test('Skal fjerne feilmelding for et spesifikt felt', () => {
      const state = { ...initialFormState, foedselAar: 1800 }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AlderStep')
      })

      expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')

      act(() => {
        handlers.clearError('foedselAar')
      })

      expect(errorFields.foedselAar).toBe('')
    })

    test('Skal ikke påvirke andre feilmeldinger når et spesifikt felt er fjernet', () => {
      const state = {
        ...initialFormState,
        simuleringType: '',
        foedselAar: 1800,
      }
      renderWithState(state)

      act(() => {
        handlers.validateFields('AFPStep')
        handlers.validateFields('AlderStep')
      })

      // Wait for state update
      setTimeout(() => {
        expect(errorFields.simuleringType).toBe('Du må velge et alternativ')
        expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')

        act(() => {
          handlers.clearError('simuleringType')
        })

        // Wait for state update
        setTimeout(() => {
          expect(errorFields.simuleringType).toBe('')
          expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')
        }, 0)
      }, 0)
    })
  })
})
