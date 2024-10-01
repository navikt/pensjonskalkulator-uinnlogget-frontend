import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import useErrorHandling from '../helpers/useErrorHandling';
import { FormValues } from '@/common';

describe('useErrorHandling', () => {
    const mockStates: FormValues = {
        simuleringType: 'type1',
        foedselAar: 1980,
        sivilstand: 'GIFT',
        epsHarInntektOver2G: true,
        epsHarPensjon: false,
        boddIUtland: 'ja',
        inntektVsaHelPensjon: 'ja',
        utenlandsAntallAar: 2,
        inntektOver1GAntallAar: 5,
        aarligInntektFoerUttakBeloep: 50000,
        gradertUttak: {
            grad: 50,
            uttakAlder: {
            aar: 67,
            maaneder: 6,
            },
            aarligInntektVsaPensjonBeloep: 25000,
        },
        heltUttak: {
            uttakAlder: {
            aar: 67,
            maaneder: 6,
            },
            aarligInntektVsaPensjon: {
            beloep: 30000,
            sluttAlder: {
                aar: null,
                maaneder: null,
            },
            },
        },
    };

  it('should validate fields for AlderStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockStates));
    const [, handlers] = result.current;

    act(() => {
      handlers.validateFields('AlderStep');
    });

    const [errorFields] = result.current;
    expect(errorFields).toEqual({
      foedselAar: null,
      inntektOver1GAntallAar: null,
    });
  });

  it('should validate fields for UtlandsStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockStates));
    const [, handlers] = result.current;

    act(() => {
      handlers.validateFields('UtlandsStep');
    });

    const [errorFields] = result.current;
    expect(errorFields).toEqual({
      boddIUtland: null,
      utenlandsAntallAar: null,
    });
  });

  it('should validate fields for InntektStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockStates));
    const [, handlers] = result.current;

    act(() => {
      handlers.validateFields('InntektStep');
    });

    const [errorFields] = result.current;
    expect(errorFields).toEqual({
      aarligInntektFoerUttakBeloep: null,
      uttaksgrad: null,
      gradertInntekt: null,
      gradertAar: null,
      gradertMaaneder: null,
      helPensjonInntekt: null,
      heltUttakAar: null,
      heltUttakMaaneder: null,
      inntektVsaHelPensjon: null,
    });
  });

  it('should validate fields for EktefelleStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockStates));
    const [, handlers] = result.current;

    act(() => {
      handlers.validateFields('EktefelleStep');
    });

    const [errorFields] = result.current;
    expect(errorFields).toEqual({
      sivilstand: null,
      epsHarInntektOver2G: null,
      epsHarPensjon: null,
    });
  });

  it('should validate fields for AFPStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockStates));
    const [, handlers] = result.current;

    act(() => {
      handlers.validateFields('AFPStep');
    });

    const [errorFields] = result.current;
    expect(errorFields).toEqual({
      simuleringType: null,
    });
  });
});