/* import { renderHook, act } from '@testing-library/react-hooks';
import { FormValues } from '@/common';
import useErrorHandling from '@/helpers/useErrorHandling';

describe('useErrorHandling', () => {
  const mockFormValues: FormValues = {
    foedselAar: 1980,
    inntektOver1GAntallAar: 5,
    boddIUtland: 'ja',
    utenlandsAntallAar: 2,
    aarligInntektFoerUttakBeloep: 50000,
    gradertUttak: {
      grad: 50,
      aarligInntektVsaPensjonBeloep: 30000,
      uttakAlder: {
        aar: 67,
        maaneder: 6
      }
    },
    heltUttak: {
      uttakAlder: {
        aar: 67,
        maaneder: 6
      },
      aarligInntektVsaPensjon: {
        beloep: 40000
      }
    },
    inntektVsaHelPensjon: 'ja',
    sivilstand: 'GIFT',
    epsHarInntektOver2G: true,
    epsHarPensjon: true,
    simuleringType: 'type1'
  };

  it('should validate fields for UtlandsStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockFormValues));
    act(() => {
      const { validateFields } = result.current[1];
      const hasErrors = validateFields('UtlandsStep');
      expect(hasErrors).toBe(false);
      expect(result.current[0]).toEqual({
        boddIUtland: null,
        utenlandsAntallAar: null
      });
    });
  });

  it('should validate fields for InntektStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockFormValues));
    act(() => {
      const { validateFields } = result.current[1];
      const hasErrors = validateFields('InntektStep');
      expect(hasErrors).toBe(false);
      expect(result.current[0]).toEqual({
        aarligInntektFoerUttakBeloep: null,
        uttaksgrad: null,
        gradertInntekt: null,
        gradertAar: null,
        gradertMaaneder: null,
        helPensjonInntekt: null,
        heltUttakAar: null,
        heltUttakMaaneder: null,
        inntektVsaHelPensjon: null
      });
    });
  });

  it('should validate fields for EktefelleStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockFormValues));
    act(() => {
      const { validateFields } = result.current[1];
      const hasErrors = validateFields('EktefelleStep');
      expect(hasErrors).toBe(false);
      expect(result.current[0]).toEqual({
        sivilstand: null,
        epsHarInntektOver2G: null,
        epsHarPensjon: null
      });
    });
  });

  it('should validate fields for AFPStep', () => {
    const { result } = renderHook(() => useErrorHandling(mockFormValues));
    act(() => {
      const { validateFields } = result.current[1];
      const hasErrors = validateFields('AFPStep');
      expect(hasErrors).toBe(false);
      expect(result.current[0]).toEqual({
        simuleringType: null
      });
    });
  });
}); */