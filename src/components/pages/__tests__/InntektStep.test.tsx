import { render, screen, fireEvent } from '@testing-library/react'
import InntektStep from '../InntektStep'
import { FormContext } from '@/contexts/context'
import useErrorHandling from '../../../helpers/useErrorHandling'
import { State } from '@/common'
import { initialFormState } from '@/defaults/defaultFormState'
import { useFieldChange } from '@/helpers/useFormState'

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
  const draft: State = { ...initialFormState }
  updateFn(draft)
  return draft
})

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  onStepChange: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const context = {
  setState: mockSetState,
  state: initialFormState,
  formPageProps: defaultFormPageProps,
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

const renderComponent = (contextOverride = context) => {
  return render(
    <FormContext.Provider value={contextOverride}>
      <InntektStep />
    </FormContext.Provider>
  )
}

describe('InntektStep Component', () => {
  test('Burde rendre komponenten', () => {
    renderComponent()
    expect(screen.getByText('Inntekt og alderspensjon')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Hva er din forventede årlige inntekt?')
    ).toBeInTheDocument()
  })

  test('Burde gå videre til neste step når skjemaet valideres uten feil', () => {
    mockValidateFields.mockReturnValue(false)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('InntektStep')
    expect(mockGoToNext).toHaveBeenCalled()
  })

  test('Burde ikke gå videre til neste step når skjemaet valideres med feil', () => {
    mockValidateFields.mockReturnValue(true)
    renderComponent()
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    expect(mockValidateFields).toHaveBeenCalledWith('InntektStep')
    expect(mockGoToNext).not.toHaveBeenCalled()
  })

  describe('Gitt at tekstfeltet for aarligInntektFoerUttakBeloep finnes', () => {
    test('Burde aarligInntektFoerUttakBeloep endres når bruker skriver inn inntekt', () => {
      renderComponent()
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

    test('Burde sette aarligInntektFoerUttakBeloep til 0 når input er tom', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: 500000,
        },
      })
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      )
      fireEvent.change(input, { target: { value: '' } })

      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'aarligInntektFoerUttakBeloep'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.aarligInntektFoerUttakBeloep).toBe(0)
    })

    test('Burde vise tom input når aarligInntektFoerUttakBeloep er 0', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: 0,
        },
      })
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      ) as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('Burde vise riktig input når aarligInntektFoerUttakBeloep ikke er 0', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
          aarligInntektFoerUttakBeloep: 500000,
        },
      })
      const input = screen.getByLabelText(
        'Hva er din forventede årlige inntekt?'
      ) as HTMLInputElement
      expect(input.value).toBe('500000')
    })
  })
  describe('Gitt at tekstfeltet for uttaksgrad finnes', () => {
    test('Burde gradertUttak.grad endres når bruker velger uttaksgrad', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
        },
      })
      const input = screen.getByLabelText('Hvilken uttaksgrad ønsker du?')
      fireEvent.change(input, { target: { value: '50' } })
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'uttaksgrad'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.gradertUttak.grad).toBe(50)
    })

    describe('Når grad ikke er 0 eller 100', () => {
      test('Burde flere input felt vises', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 50, uttakAlder: { aar: 0, maaneder: -1 } },
          },
        })
        const input = screen.getByLabelText('Hvilken uttaksgrad ønsker du?')
        fireEvent.change(input, { target: { value: '50' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
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
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 50, uttakAlder: { aar: 0, maaneder: -1 } },
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

      test('Burde gradertUttak.uttakAlder.maaneder endres når bruker velger uttaksmåned', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 50, uttakAlder: { aar: 0, maaneder: -1 } },
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

      test('Burde gradertUttak.aarligInntektVsaPensjonBeloep endres når bruker angir inntekt ved siden av gradert pensjon som er større enn 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 50, uttakAlder: { aar: 0, maaneder: -1 } },
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

      test('Burde sette gradertUttak.aarligInntektVsaPensjonBeloep til 0 når input er tom', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
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
        expect(draft.gradertUttak.aarligInntektVsaPensjonBeloep).toBe(0)
      })

      test('Burde vise tom input når gradertUttak.aarligInntektVsaPensjonBeloep er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: {
              grad: 50,
              uttakAlder: { aar: 0, maaneder: -1 },
              aarligInntektVsaPensjonBeloep: 0,
            },
          },
        })
        const input = screen.getByLabelText(
          'Hva forventer du å ha i årlig inntekt samtidig som du tar 50% pensjon?'
        ) as HTMLInputElement
        expect(input.value).toBe('')
      })
    })
    describe('Når grad er 0 eller 100', () => {
      test('Burde ikke input felt vises dersom grad er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 0, uttakAlder: { aar: 0, maaneder: -1 } },
          },
        })

        const input = screen.getByLabelText('Hvilken uttaksgrad ønsker du?')
        fireEvent.change(input, { target: { value: '0' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.grad).toBe(0)
        expect(
          screen.queryByLabelText(
            `Når planlegger du å ta ut ${draft.gradertUttak.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
        expect(
          screen.queryByLabelText(
            `Hva forventer du å ha i årlig inntekt samtidig som du tar ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
      })

      test('Burde ikke input felt vises dersom grad er 100', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            gradertUttak: { grad: 100, uttakAlder: { aar: 0, maaneder: -1 } },
          },
        })
        const input = screen.getByLabelText('Hvilken uttaksgrad ønsker du?')
        fireEvent.change(input, { target: { value: '100' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'uttaksgrad'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.gradertUttak.grad).toBe(100)
        expect(
          screen.queryByLabelText(
            `Hva forventer du å ha i årlig inntekt samtidig som du tar ${draft.gradertUttak?.grad}% pensjon?`
          )
        ).not.toBeInTheDocument()
      })
    })
  })
  describe('Gitt at dropdowns for heltUttak alder og måned finnes', () => {
    test('Burde heltUttak.uttakAlder.aar endres når bruker velger uttaksalder', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
          heltUttak: { uttakAlder: { aar: 0, maaneder: -1 } },
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

    test('Burde heltUttak.uttakAlder.maaneder endres når bruker velger uttaksmåned', () => {
      renderComponent({
        ...context,
        state: {
          ...initialFormState,
          heltUttak: { uttakAlder: { aar: 0, maaneder: -1 } },
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
  describe('Gitt at radioknappen for inntekt etter uttak av hel pensjon finnes', () => {
    test('Burde inntektVsaHelPensjon endres når handleFieldChange kalles på', () => {
      renderComponent()
      const radio = screen.getByLabelText('Ja')
      fireEvent.click(radio)
      expect(mockHandleFieldChange).toHaveBeenCalledWith(
        expect.any(Function),
        'inntektVsaHelPensjon'
      )

      const draft = mockHandleFieldChange.mock.results[0].value
      expect(draft.inntektVsaHelPensjon).toBe('ja')
    })

    describe('Når inntektVsaHelPensjon er "Nei"', () => {
      test('Burde ikke input felt for heltUttak.aarligInntektVsaPensjon.beloep vises', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'nei',
          },
        })
        expect(
          screen.queryByLabelText(
            'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
          )
        ).not.toBeInTheDocument()
      })
    })

    describe('Når inntektVsaHelPensjon er "Ja"', () => {
      test('Burde input felt for heltUttak.aarligInntektVsaPensjon.beloep vises', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'ja',
          },
        })
        expect(
          screen.getByLabelText(
            'Hva forventer du å ha i årlig inntekt samtidig som du tar ut hel pensjon?'
          )
        ).toBeInTheDocument()
      })

      test('Burde heltUttak.aarligInntektVsaPensjonBeloep endres når bruker angir inntekt ved siden av hel pensjon som er større enn 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'ja',
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

      test('Burde sette heltUttak.aarligInntektVsaPensjon.beloep til 0 når input er tom', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'ja',
            heltUttak: {
              uttakAlder: {
                aar: 0,
                maaneder: -1,
              },
              aarligInntektVsaPensjon: {
                beloep: 50000,
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
        )
        fireEvent.change(input, { target: { value: '' } })
        expect(mockHandleFieldChange).toHaveBeenCalledWith(
          expect.any(Function),
          'helPensjonInntekt'
        )

        const draft = mockHandleFieldChange.mock.results[0].value
        expect(draft.heltUttak.aarligInntektVsaPensjon.beloep).toBe(0)
      })

      test('Burde vise tom input når heltUttak.aarligInntektVsaPensjon.beloep er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'ja',
            heltUttak: {
              uttakAlder: {
                aar: 0,
                maaneder: -1,
              },
              aarligInntektVsaPensjon: {
                beloep: 0,
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
        expect(input.value).toBe('')
      })

      test('Burde vise riktig input når heltUttak.aarligInntektVsaPensjon.beloep ikke er 0', () => {
        renderComponent({
          ...context,
          state: {
            ...initialFormState,
            inntektVsaHelPensjon: 'ja',
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
            renderComponent({
              ...context,
              state: {
                ...initialFormState,
                inntektVsaHelPensjon: 'ja',
              },
            })

            expect(
              document.getElementById(
                'heltUttakSluttAlderMaaneder'
              ) as HTMLSelectElement
            ).not.toBeInTheDocument()
          })
        })
        describe('Når sluttAlder ikke er livsvarig', () => {
          test('Burde input felt for heltUttak.sluttAlder.maaneder vises', () => {
            renderComponent({
              ...context,
              state: {
                ...initialFormState,
                inntektVsaHelPensjon: 'ja',
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
              'heltUttakSluttAlderMaaneder'
            )

            const draft = mockHandleFieldChange.mock.results[1].value
            expect(
              draft.heltUttak.aarligInntektVsaPensjon.sluttAlder.maaneder
            ).toBe(6)
          })

          test('Burde sette riktig verdi når sluttAlder.aar er definert', () => {
            renderComponent({
              ...context,
              state: {
                ...initialFormState,
                inntektVsaHelPensjon: 'ja',
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
            renderComponent({
              ...context,
              state: {
                ...initialFormState,
                inntektVsaHelPensjon: 'ja',
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

          test('Burde sette sluttAlder.aar til 0 når livsvarig er valgt', () => {
            renderComponent({
              ...context,
              state: {
                ...initialFormState,
                inntektVsaHelPensjon: 'ja',
                heltUttak: {
                  uttakAlder: {
                    aar: 0,
                    maaneder: -1,
                  },
                  aarligInntektVsaPensjon: {
                    beloep: 500000,
                    sluttAlder: {
                      aar: 66,
                      maaneder: -1,
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
              0
            )
          })
        })
      })
    })
  })
})
