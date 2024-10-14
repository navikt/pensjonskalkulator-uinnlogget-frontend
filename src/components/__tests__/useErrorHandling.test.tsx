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

  describe('Riktig validering for den initielle formstaten', () => {
    beforeEach(() => {
      const TestComponent = () => {
        const result = useErrorHandling(initialFormState)
        errorFields = result[0]
        handlers = result[1]
        return null
      }

      render(
        <FormContext.Provider
          value={{
            states: initialFormState,
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

  describe('Riktig validering av AlderStep', () => {
    //Sjekk ulike varianter for validering av AlderStep
  })

  describe('Riktig validering av UtenlandsStep', () => {
    //Sjekk ulike varianter for validering av UtenlandsStep
  })

  describe('Riktig validering av InntektStep', () => {
    describe('Riktig validering for ulike varianter av gradert uttak', () => {
      //fyll inn
    })
    describe('Riktig validering for ulike varianter av inntekt ved siden av hel pensjon', () => {
      //fyll inn
    })
    //fyll inn
  })

  describe('Riktig validering av EktefelleStep', () => {
    //Sjekk ulike varianter for validering av EktefellleStep
  })

  describe('Riktig validering av AFPStep', () => {
    //Sjekk ulike varianter for validering av EktefellleStep
  })
})
