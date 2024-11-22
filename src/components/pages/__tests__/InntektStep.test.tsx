import { screen, fireEvent } from '@testing-library/react'
import InntektStep from '../InntektStep'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { State } from '@/common'
import { initialState } from '@/defaults/initialState'
import { useFieldChange } from '@/helpers/useFormState'
import {
  renderMockedComponent,
  generateDefaultFormPageProps,
} from '../test-utils/testSetup'

// Mock the useErrorHandling hook
jest.mock('../../../helpers/useErrorHandling', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the useFieldChange hook
jest.mock('@/helpers/useFormState', () => ({
  __esModule: true,
  useFieldChange: jest.fn(),
}))

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()
const mockHandleFieldChange = jest.fn((updateFn) => {
  const draft: State = { ...initialState }
  updateFn(draft)
  return draft
})

const context = {
  setState: mockSetState,
  state: initialState,
  formPageProps: generateDefaultFormPageProps(mockGoToNext),
}

const mockValidateFields = jest.fn()
const mockClearError = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useErrorHandling as jest.Mock).mockReturnValue([
    {},
    { validateFields: mockValidateFields, clearError: mockClearError },
  ])
  ;(useFieldChange as jest.Mock).mockReturnValue({
    handleFieldChange: mockHandleFieldChange,
  })
})

describe('InntektStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderMockedComponent(InntektStep, context)
    expect(screen.getByText('Inntekt og alderspensjon')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Hva er din forventede årlige inntekt?')
    ).toBeInTheDocument()
  })

  test.skip('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderMockedComponent(InntektStep, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('InntektStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test.skip('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderMockedComponent(InntektStep, context)
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('InntektStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe.skip('Gitt at tekstfeltet for aarligInntektFoerUttakBeloep finnes', () => {
    test('Burde aarligInntektFoerUttakBeloep endres når bruker skriver inn inntekt', () => {
      renderMockedComponent(InntektStep, context)
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      )
      fireEvent.change(input, { target: { value: '500000' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'aarligInntektFoerUttakBeloep'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.aarligInntektFoerUttakBeloep).toBe(500000)
    })

    test('Burde vise tom input når aarligInntektFoerUttakBeloep er undefined', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
          aarligInntektFoerUttakBeloep: undefined,
        },
      })
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      ) as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('Burde vise riktig input når aarligInntektFoerUttakBeloep ikke er 0', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
          aarligInntektFoerUttakBeloep: 500000,
        },
      })
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      ) as HTMLInputElement
      expect(input.value).toBe('500000')
    })
  })

  describe.skip('Gitt at tekstfeltet for uttaksgrad finnes', () => {
    test('Burde gradertUttak.grad endres når bruker velger uttaksgrad', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
        },
      })
      const input = screen.getByLabelText(
        'Hvor mye alderspensjon vil du ta ut?'
      )
      fireEvent.change(input, { target: { value: '50' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'uttaksgrad'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.gradertUttak.grad).toBe(50)
    })

    describe('Når gradertUttak ikke er undefined og grad ikke er 100', () => {
      test('Burde input felt for gradert uttak vises', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: null,
              uttakAlder: {
                aar: null,
                maaneder: null,
              },
            },
          },
        })
        const input = screen.getByLabelText(
          'Hvor mye alderspensjon vil du ta ut?'
        )
        fireEvent.change(input, { target: { value: '50' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        console.log('Draft:', draft)
        expect(draft.gradertUttak.grad).toBe(50)

        expect(
          screen.getByLabelText(
            `Når planlegger du å ta ut ${draft.gradertUttak.grad}% pensjon?`
          )
        ).toBeInTheDocument()

        expect(
          screen.getByLabelText(
            `Hva forventer du å ha i årlig inntekt samtidig som du tar ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).toBeInTheDocument()
      })

      test('Burde gradertUttak.uttakAlder.aar endres når bruker velger uttakalder', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 0, maaneder: -1 },
            },
          },
        })
        const input = screen.getByLabelText(
          'Når planlegger du å ta ut 50% pensjon?'
        )
        fireEvent.change(input, { target: { value: '66' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.uttakAlder.aar).toBe(66)
      })

      test('Burde gradertUttak.uttakAlder.aar settes til null når bruker velger tom uttaksalder', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 66, maaneder: -1 },
            },
          },
        })
        const input = screen.getByLabelText(
          'Når planlegger du å ta ut 50% pensjon?'
        )
        fireEvent.change(input, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertAar'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.uttakAlder.aar).toBe(null)
      })

      test('Burde gradertUttak.uttakAlder.maaneder endres når bruker velger uttaksmåned', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 0, maaneder: -1 },
            },
          },
        })

        const input = document.getElementById(
          'gradertMaaneder'
        ) as HTMLSelectElement

        fireEvent.change(input, { target: { value: '6' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertMaaneder'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.uttakAlder.maaneder).toBe(6)
      })

      test('Burde gradertUttak.uttakAlder.maaneder settes til null når bruker velger tom uttaksalder', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 66, maaneder: -1 },
            },
          },
        })
        const input = document.getElementById(
          'gradertMaaneder'
        ) as HTMLSelectElement

        fireEvent.change(input, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertMaaneder'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.uttakAlder.aar).toBe(null)
      })

      test('Burde gradertUttak.aarligInntektVsaPensjonBeloep endres når bruker angir inntekt ved siden av gradert pensjon som er større enn 0', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 0, maaneder: -1 },
            },
          },
        })

        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar 50% pensjon?'
        )
        fireEvent.change(input, { target: { value: '500000' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertInntekt'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.aarligInntektVsaPensjonBeloep).toBe(500000)
      })

      test('Burde sette gradertUttak.aarligInntektVsaPensjonBeloep til null når input er tom', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 0, maaneder: -1 },
              aarligInntektVsaPensjonBeloep: 500000,
            },
          },
        })

        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar 50% pensjon?'
        )
        fireEvent.change(input, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'gradertInntekt'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.aarligInntektVsaPensjonBeloep).toBe(null)
      })

      test('Burde vise tom input når gradertUttak.aarligInntektVsaPensjonBeloep er undefined', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 50,
              uttakAlder: null,
            },
          },
        })
        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar 50% pensjon?'
        ) as HTMLInputElement
        expect(input.value).toBe('')
      })
    })

    describe('Når gradertUttak er undefined eller grad er 100', () => {
      test('Burde ikke input felt vises dersom gradertUttak er undefined', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: undefined,
          },
        })

        const input = screen.getByLabelText(
          'Hvor mye alderspensjon vil du ta ut?'
        )
        fireEvent.change(input, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak).toBeUndefined()
        expect(
          screen.queryByLabelText(
            `Når planlegger du å ta ut ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
        expect(
          screen.queryByLabelText(
            `Hva forventer du å ha i årlig inntekt samtidig som du tar ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
      })

      test('Burde ikke input felt vises dersom grad er 100', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            gradertUttak: {
              grad: 100,
              uttakAlder: { aar: 0, maaneder: -1 },
            },
          },
        })
        const input = screen.getByLabelText(
          'Hvor mye alderspensjon vil du ta ut?'
        )
        fireEvent.change(input, { target: { value: '100' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.grad).toBe(null)
        expect(
          screen.queryByLabelText(
            `Hva forventer du å ha i årlig inntekt samtidig som du tar ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
      })
    })
  })

  describe.skip('Gitt at dropdowns for heltUttak alder og måned finnes', () => {
    test('Burde heltUttak.uttakAlder.aar endres når bruker velger uttaksalder', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: {
              beloep: null,
              sluttAlder: undefined,
            },
          },
        },
      })
      const input = screen.getByLabelText(
        'Når planlegger du å ta ut 100% pensjon?'
      )
      fireEvent.change(input, { target: { value: '67' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'heltUttakAar'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.heltUttak.uttakAlder.aar).toBe(67)
    })

    test('Burde heltUttak.uttakAlder.aar settes til null når bruker velger tom uttaksalder', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
          heltUttak: {
            uttakAlder: { aar: 67, maaneder: -1 },
            aarligInntektVsaPensjon: {
              beloep: null,
              sluttAlder: undefined,
            },
          },
        },
      })
      const input = screen.getByLabelText(
        'Når planlegger du å ta ut 100% pensjon?'
      )
      fireEvent.change(input, { target: { value: '' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'heltUttakAar'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.heltUttak.uttakAlder.aar).toBe(null)
    })

    test('Burde heltUttak.uttakAlder.maaneder endres når bruker velger uttaksmåned', () => {
      renderMockedComponent(InntektStep, {
        ...context,
        state: {
          ...initialState,
          heltUttak: {
            uttakAlder: { aar: 0, maaneder: -1 },
            aarligInntektVsaPensjon: {
              beloep: null,
              sluttAlder: undefined,
            },
          },
        },
      })

      const input = document.getElementById(
        'heltUttakMaaneder'
      ) as HTMLSelectElement

      fireEvent.change(input, { target: { value: '4' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'heltUttakMaaneder'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.heltUttak.uttakAlder.maaneder).toBe(4)
    })
  })

  test.skip('Burde heltUttak.uttakAlder.maaneder settes til null når bruker velger tom uttaksalder', () => {
    renderMockedComponent(InntektStep, {
      ...context,
      state: {
        ...initialState,
        heltUttak: {
          uttakAlder: { aar: 67, maaneder: 4 },
          aarligInntektVsaPensjon: {
            beloep: null,
            sluttAlder: undefined,
          },
        },
      },
    })
    const input = document.getElementById(
      'heltUttakMaaneder'
    ) as HTMLSelectElement

    fireEvent.change(input, { target: { value: '' } })
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      expect.any(Function),
      'heltUttakMaaneder'
    )

    const draft = mockHandleFieldChange.mock.results[0].value
    expect(draft.heltUttak.uttakAlder.maaneder).toBe(null)
  })

  describe.skip('Gitt at radioknappen for inntekt etter uttak av hel pensjon finnes', () => {
    test('Burde harInntektVsaHelPensjon endres når handleFieldChange kalles på', () => {
      renderMockedComponent(InntektStep, context)
      const radio = screen.getByLabelText('Ja')
      fireEvent.click(radio)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'harInntektVsaHelPensjon'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.harInntektVsaHelPensjon).toBe('ja')
    })

    describe('Når harInntektVsaHelPensjon er "Nei"', () => {
      test('Burde ikke input felt for heltUttak.aarligInntektVsaPensjon.beloep vises', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            harInntektVsaHelPensjon: 'nei',
          },
        })
        expect(
          screen.queryByLabelText(
            'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
          )
        ).not.toBeInTheDocument()
      })
    })

    describe('Når harInntektVsaHelPensjon er "Ja"', () => {
      test('Burde input felt for heltUttak.aarligInntektVsaPensjon.beloep vises', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            harInntektVsaHelPensjon: 'ja',
          },
        })
        expect(
          screen.getByLabelText(
            'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
          )
        ).toBeInTheDocument()
      })

      test('Burde heltUttak.aarligInntektVsaPensjonBeloep endres når bruker angir inntekt ved siden av hel pensjon som er større enn 0', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            harInntektVsaHelPensjon: 'ja',
          },
        })

        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
        )
        fireEvent.change(input, { target: { value: '500000' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'helPensjonInntekt'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.heltUttak.aarligInntektVsaPensjon.beloep).toBe(500000)
      })

      test('Burde vise tom input når heltUttak.aarligInntektVsaPensjon.beloep er null', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            harInntektVsaHelPensjon: 'ja',
            heltUttak: {
              uttakAlder: {
                aar: 0,
                maaneder: -1,
              },
              aarligInntektVsaPensjon: {
                beloep: null,
                sluttAlder: undefined,
              },
            },
          },
        })
        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
        ) as HTMLInputElement
        expect(input.value).toBe('')
      })

      test('Burde vise riktig input når heltUttak.aarligInntektVsaPensjon.beloep ikke er 0', () => {
        renderMockedComponent(InntektStep, {
          ...context,
          state: {
            ...initialState,
            harInntektVsaHelPensjon: 'ja',
            heltUttak: {
              uttakAlder: {
                aar: 0,
                maaneder: -1,
              },
              aarligInntektVsaPensjon: {
                beloep: 500000,
                sluttAlder: {
                  aar: 0,
                  maaneder: -1,
                },
              },
            },
          },
        })
        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
        ) as HTMLInputElement
        expect(input.value).toBe('500000')
      })

      describe('Gitt at dropdown for sluttAlder finnes', () => {
        describe('Når sluttAlder er livsvarig', () => {
          test('Burde ikke input felt for heltUttak.sluttAlder.maaneder vises', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
              },
            })

            expect(
              document.getElementById(
                'heltUttakSluttAlder'
              ) as HTMLSelectElement
            ).not.toBeInTheDocument()
          })
        })

        describe('Når sluttAlder ikke er livsvarig', () => {
          test('Burde input felt for heltUttak.sluttAlder.maaneder vises', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 0,
                    maaneder: -1,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: {
                      aar: 0,
                      maaneder: -1,
                    },
                  },
                },
              },
            })

            const ageSelect = screen.getByLabelText(
              'Til hvilken alder forventer du å ha inntekten?'
            )
            fireEvent.change(ageSelect, { target: { value: '65' } })
            expect(mockHandleFieldChange).toHaveBeenCalledWith(
              expect.any(Function),
              'heltUttakAar'
            )
            const monthSelect = screen.getByLabelText('Velg måned')
            expect(monthSelect).toBeInTheDocument()

            fireEvent.change(monthSelect, { target: { value: '6' } })
            expect(mockHandleFieldChange).toHaveBeenCalledWith(
              expect.any(Function),
              'heltUttakSluttAlder'
            )

            const draft = mockHandleFieldChange.mock.results[1].value
            expect(
              draft.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder
            ).toBe(6)
          })

          test('Burde sette heltUttak.sluttAlder.maaneder til null når bruker velger tom måned', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 0,
                    maaneder: -1,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: {
                      aar: 0,
                      maaneder: 6,
                    },
                  },
                },
              },
            })

            const ageSelect = screen.getByLabelText(
              'Til hvilken alder forventer du å ha inntekten?'
            )
            fireEvent.change(ageSelect, { target: { value: '65' } })
            expect(mockHandleFieldChange).toHaveBeenCalledWith(
              expect.any(Function),
              'heltUttakAar'
            )

            const monthSelect = screen.getByLabelText('Velg måned')
            fireEvent.change(monthSelect, { target: { value: '' } })
            expect(mockHandleFieldChange).toHaveBeenCalledWith(
              expect.any(Function),
              'heltUttakSluttAlder'
            )

            const draft = mockHandleFieldChange.mock.results[1].value
            expect(
              draft.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder
            ).toBe(null)
          })

          test('Burde sette riktig verdi når sluttAlder.aar er definert', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 0,
                    maaneder: -1,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: {
                      aar: 65,
                      maaneder: -1,
                    },
                  },
                },
              },
            })

            const ageSelect = screen.getByLabelText(
              'Til hvilken alder forventer du å ha inntekten?'
            ) as HTMLSelectElement
            expect(ageSelect.value).toBe('65')
          })

          test('Burde sette riktig verdi når sluttAlder er udefinert', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 0,
                    maaneder: -1,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: undefined,
                  },
                },
              },
            })

            const ageSelect = screen.getByLabelText(
              'Til hvilken alder forventer du å ha inntekten?'
            ) as HTMLSelectElement
            expect(ageSelect.value).toBe('livsvarig')
          })

          test('Burde sette sluttAlder.aar til null når livsvarig er valgt', () => {
            renderMockedComponent(InntektStep, {
              ...context,
              state: {
                ...initialState,
                harInntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 62,
                    maaneder: 2,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: {
                      aar: 66,
                      maaneder: null,
                    },
                  },
                },
              },
            })

            const ageSelect = screen.getByLabelText(
              'Til hvilken alder forventer du å ha inntekten?'
            )
            fireEvent.change(ageSelect, { target: { value: 'livsvarig' } })
            expect(mockHandleFieldChange).toHaveBeenCalledWith(
              expect.any(Function),
              'heltUttakAar'
            )

            const draft = mockHandleFieldChange.mock.results[0].value
            expect(draft.heltUttak.aarligInntektVsaPensjon.sluttAlder.aar).toBe(
              null
            )
          })
        })
      })
    })
  })
})
