import React from 'react'
import { render, act } from '@testing-library/react'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'
import useErrorHandling from '@/helpers/useErrorHandling'
import { Simuleringstype, Sivilstand, State } from '@/common'

describe('useErrorHandling', () => {
  let errorFields: { [key: string]: string }
  let handlers: {
    validateFields: (
      step:
        | 'AlderStep'
        | 'UtlandsStep'
        | 'InntektStep'
        | 'SivilstandStep'
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
            goTo: jest.fn(),
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
      test('Skal validere at foedselAar ikke er mindre enn 1945', () => {
        const state = { ...initialState, foedselAar: '1940' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')
      })

      test('Skal validere at foedselAar ikke er etter dagens dato', () => {
        const state = {
          ...initialState,
          foedselAar: '' + new Date().getFullYear() + 1,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('Du må oppgi et gyldig årstall')
      })

      test('Skal ikke gi feil ved gyldig foedselAar', () => {
        const state = { ...initialState, foedselAar: '1990' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.foedselAar).toBe('')
      })
    })

    describe('inntektOver1GAntallAar', () => {
      test('Skal gi feilmelding når antall år er undefined', () => {
        const state = { ...initialState, inntektOver1GAntallAar: null }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Du må fylle ut antall år'
        )
      })

      test('Skal gi feilmelding når antall år er undefined', () => {
        const state = { ...initialState, inntektOver1GAntallAar: null }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Du må fylle ut antall år'
        )
      })

      test('Skal gi feilmelding når antall år er negativt', () => {
        const state = { ...initialState, inntektOver1GAntallAar: '-10' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Antall år kan ikke være negativt'
        )
      })

      test('Skal gi feilmelding når antall år overstiger 50', () => {
        const state = { ...initialState, inntektOver1GAntallAar: '51' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Du kan ikke være yrkesaktiv i mer enn 50 år'
        )
      })

      test('Skal ikke gi feilmelding ved gyldig antall år', () => {
        const state = { ...initialState, inntektOver1GAntallAar: '25' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe('')
      })

      test('Skal ikke gi feil når bruker oppgir tekst i antall år', () => {
        const state = { ...initialState, inntektOver1GAntallAar: '40o' }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AlderStep')
        })

        expect(errorFields.inntektOver1GAntallAar).toBe(
          'Du må fylle ut en gyldig inntekt'
        )
      })
    })
  })

  describe('Validering for UtlandsStep', () => {
    describe('harBoddIUtland', () => {
      test('Skal gi feilmelding når harBoddIUtland ikke er valgt', () => {
        const state = { ...initialState, harBoddIUtland: null }
        renderWithState(state)

        act(() => {
          handlers.validateFields('UtlandsStep')
        })

        expect(errorFields.harBoddIUtland).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når harBoddIUtland er valgt', () => {
        const state = { ...initialState, harBoddIUtland: true }
        renderWithState(state)

        act(() => {
          handlers.validateFields('UtlandsStep')
        })

        expect(errorFields.harBoddIUtland).toBe('')
      })
    })

    describe('utenlandsAntallAar', () => {
      describe('Når harBoddIUtland er nei', () => {
        test('Skal ikke gi feilmelding når utenlandsAntallAar er undefined', () => {
          const state = {
            ...initialState,
            harBoddIUtland: false,
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
            ...initialState,
            harBoddIUtland: false,
            utenlandsAntallAar: '0',
          }
          renderWithState(state)

          act(() => {
            handlers.validateFields('UtlandsStep')
          })

          expect(errorFields.utenlandsAntallAar).toBe('')
        })
      })
      describe('Når harBoddIUtland er ja', () => {
        test('Skal gi feilmelding når utenlandsAntallAar er 0', () => {
          const state = {
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: '0',
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
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: '-1',
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
            ...initialState,
            harBoddIUtland: true,
            utenlandsAntallAar: '5',
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
          ...initialState,
          aarligInntektFoerUttakBeloep: null,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Du må fylle ut inntekt'
        )
      })

      test('Skal gi feilmelding når inntekt er negativ', () => {
        const state = {
          ...initialState,
          aarligInntektFoerUttakBeloep: '-1000',
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Inntekt kan ikke være negativ'
        )
      })

      test('Skal gi feilmelding når inntekt er over 100 000 000', () => {
        const state = {
          ...initialState,
          aarligInntektFoerUttakBeloep: '100000001',
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Inntekten kan ikke overskride 100 000 000 kroner'
        )
      })

      test('Skal ikke gi feilmelding når inntekt er gyldig', () => {
        const state = {
          ...initialState,
          aarligInntektFoerUttakBeloep: '500000',
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe('')
      })

      test('Skal gi feilmelding når brukeren har skrevet inn tekst i beløp', () => {
        const state = {
          ...initialState,
          aarligInntektFoerUttakBeloep: '1000o',
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.aarligInntektFoerUttakBeloep).toBe(
          'Du må fylle ut en gyldig inntekt'
        )
      })
    })

    describe('uttaksgrad', () => {
      test('Skal gi feilmelding når uttaksgrad er null', () => {
        const state = {
          ...initialState,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.uttaksgrad).toBe('Du må velge uttaksgrad')
      })

      test('Skal ikke gi feilmelding når uttaksgrad er gyldig', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: null, maaneder: null },
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
      test('Skal gi feilmelding når gradert uttak har gyldig grad, men inntekt ikke er utfylt', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: undefined,
            uttaksalder: { aar: null, maaneder: null },
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
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '-1000',
            uttaksalder: { aar: null, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe('Inntekt kan ikke være negativ')
      })

      test('Skal gi feilmelding når gradert uttak har gyldig grad og inntekt inneholder tekst', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '1000o',
            uttaksalder: { aar: null, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe(
          'Du må fylle ut en gyldig inntekt'
        )
      })

      test('Skal gi feilmelding når gradert uttak har gyldig grad og inntekt er over 100 000 000', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '100000001',
            uttaksalder: { aar: null, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe(
          'Inntekten kan ikke overskride 100 000 000 kroner'
        )
      })

      test('Skal ikke gi feilmelding når gradert uttak har gyldig grad og inntekt er utfylt', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '300000',
            uttaksalder: { aar: null, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertInntekt).toBe('')
      })
    })

    describe('gradertUttaksalder', () => {
      test('Skal gi feilmelding når gradert uttak har gyldig grad', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: null, maaneder: 0 },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertUttaksalder).toBe('Du må velge alder')
      })

      test('Skal gi feilmelding når gradert uttak har gyldig grad og alder er lavere enn fødselsår', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: 62, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertUttaksalder).toBe(
          'Din uttaksalder kan ikke være lavere enn ditt fødselsår'
        )
      })

      test('Skal ikke gi feilmelding når gradert uttak har gyldig grad og alder er valgt', () => {
        const state = {
          ...initialState,
          foedselAar: '1960',
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: 67, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertUttaksalder).toBe('')
      })

      test('Skal ikke gi feilmelding når grad er 100 og uttaksår ikke er valgt', () => {
        const state = {
          ...initialState,
          foedselAar: '1960',
          gradertUttak: {
            grad: 100,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: 67, maaneder: null },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.gradertUttaksalder).toBe('')
      })
    })

    describe('heltUttaksalder', () => {
      test('Skal gi feilmelding når heltUttaksalder er null', () => {
        const state = {
          ...initialState,
          heltUttak: {
            uttaksalder: { aar: null, maaneder: 1 },
            aarligInntektVsaPensjon: { beloep: '0', sluttAlder: undefined },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttaksalder).toBe('Du må velge alder')
      })

      test('Skal gi feilmelding når heltUttaksalder er lavere enn fødselsår', () => {
        const state = {
          ...initialState,
          heltUttak: {
            uttaksalder: { aar: 67, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '0', sluttAlder: undefined },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttaksalder).toBe(
          'Din uttaksalder kan ikke være lavere enn ditt fødselsår'
        )
      })

      test('Skal gi feilmelding når heltUttaksalder er lavere enn gradert uttaksalder', () => {
        const state = {
          ...initialState,
          gradertUttak: {
            grad: 50,
            aarligInntektVsaPensjonBeloep: '0',
            uttaksalder: { aar: 67, maaneder: null },
          },
          heltUttak: {
            uttaksalder: { aar: 65, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '0', sluttAlder: undefined },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttaksalder).toBe(
          'Du må oppgi en senere alder for 100 % uttak enn den du har oppgitt for gradert uttak'
        )
      })

      test('Skal ikke gi feilmelding når heltUttaksalder er gyldig', () => {
        const state = {
          ...initialState,
          foedselAar: '1960',
          heltUttak: {
            uttaksalder: { aar: 70, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '0', sluttAlder: undefined },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttaksalder).toBe('')
      })
    })

    describe('inntektVsaHelPensjon', () => {
      test('Skal gi feilmelding når hel pensjon er valgt, men inntekt er ikke utfylt', () => {
        const state = {
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 0, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '0', sluttAlder: undefined },
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
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 0, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '-5000', sluttAlder: undefined },
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

      test('Skal gi feilmelding når hel pensjon er valgt og inntekt inneholder tekst', () => {
        const state = {
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 0, maaneder: null },
            aarligInntektVsaPensjon: { beloep: '1000o', sluttAlder: undefined },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe(
          'Du må fylle ut en gyldig inntekt'
        )
      })

      test('Skal gi feilmelding når hel pensjon er valgt og inntekt er over 100 000 000', () => {
        const state = {
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 0, maaneder: null },
            aarligInntektVsaPensjon: {
              beloep: '100000001',
              sluttAlder: undefined,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe(
          'Inntekten kan ikke overskride 100 000 000 kroner'
        )
      })

      test('Skal ikke gi feilmelding når hel pensjon er valgt og inntekt er utfylt', () => {
        const state = {
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 0, maaneder: null },
            aarligInntektVsaPensjon: {
              beloep: '200000',
              sluttAlder: undefined,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.helPensjonInntekt).toBe('')
      })
    })

    describe('heltUttakSluttAlderAar', () => {
      test('Skal gi feilmelding når sluttalder.aar ikke er satt', () => {
        const state = {
          ...initialState,
          harInntektVsaHelPensjon: true,
          heltUttak: {
            uttaksalder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: '0',
              sluttAlder: { aar: null, maaneder: 0 },
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakSluttAlderAar).toBe('Du må velge alder')
      })

      test('Skal ikke gi feilmelding dersom sluttalder er undefined (livsvarig inntekt ved siden av pensjon)', () => {
        const state = {
          ...initialState,
          heltUttak: {
            uttaksalder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: '0',
              sluttAlder: undefined,
            },
          },
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.heltUttakSluttAlderAar).toBe('')
      })
    })

    describe('harInntektVsaHelPensjon', () => {
      test('Skal gi feilmelding når brukeren ikke har valgt om de har inntekt ved hel pensjon', () => {
        const state = { ...initialState, harInntektVsaHelPensjon: null }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.harInntektVsaHelPensjon).toBe('Velg alternativ')
      })

      test('Skal ikke gi feilmelding når brukeren har valgt om de har inntekt ved hel pensjon', () => {
        const state = { ...initialState, harInntektVsaHelPensjon: false }
        renderWithState(state)

        act(() => {
          handlers.validateFields('InntektStep')
        })

        expect(errorFields.harInntektVsaHelPensjon).toBe('')
      })
    })
  })

  describe('Validering for SivilstandStep', () => {
    describe('sivilstand', () => {
      test('Skal gi feilmelding når sivilstand ikke er satt', () => {
        const state = {
          ...initialState,
          sivilstand: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.sivilstand).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når sivilstand er valgt', () => {
        const state = {
          ...initialState,
          sivilstand: 'UGIFT' as Sivilstand,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.sivilstand).toBe('')
      })
    })

    describe('epsHarInntektOver2G', () => {
      test('Skal gi feilmelding når epsHarInntektOver2G ikke er valgt', () => {
        const state = {
          ...initialState,
          sivilstand: 'GIFT' as Sivilstand,
          epsHarInntektOver2G: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.epsHarInntektOver2G).toBe(
          'Du må velge et alternativ'
        )
      })

      test('Skal ikke gi feilmelding når epsHarInntektOver2G er valgt', () => {
        const state = {
          ...initialState,
          sivilstand: 'GIFT' as Sivilstand,
          epsHarInntektOver2G: true,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.epsHarInntektOver2G).toBe('')
      })
    })

    describe('epsHarPensjon', () => {
      test('Skal gi feilmelding når epsHarPensjon ikke er valgt', () => {
        const state = {
          ...initialState,
          sivilstand: 'GIFT' as Sivilstand,
          epsHarPensjon: undefined,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.epsHarPensjon).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når epsHarPensjon er valgt', () => {
        const state = {
          ...initialState,
          sivilstand: 'GIFT' as Sivilstand,
          epsHarPensjon: false,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('SivilstandStep')
        })

        expect(errorFields.epsHarPensjon).toBe('')
      })
    })
  })

  describe('Validering for AFPStep', () => {
    describe('simuleringType', () => {
      test('Skal gi feilmelding når simuleringType ikke er valgt', () => {
        const state = { ...initialState, simuleringType: undefined }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AFPStep')
        })

        expect(errorFields.simuleringstype).toBe('Du må velge et alternativ')
      })

      test('Skal ikke gi feilmelding når simuleringType er valgt', () => {
        const state = {
          ...initialState,
          simuleringstype: 'ALDERSPENSJON' as Simuleringstype,
        }
        renderWithState(state)

        act(() => {
          handlers.validateFields('AFPStep')
        })

        expect(errorFields.simuleringstype).toBe('')
      })
    })
  })

  describe('clearError', () => {
    test('Skal fjerne feilmelding for et spesifikt felt', () => {
      const state = { ...initialState, foedselAar: '1800' }
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
        ...initialState,
        simuleringType: '',
        foedselAar: '1800',
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
