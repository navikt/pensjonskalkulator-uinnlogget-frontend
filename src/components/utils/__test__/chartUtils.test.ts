import { getChartOptions } from '../chartUtils'

describe('getChartOptions', () => {
  const heltUttakAar = 67
  const inntektVsaHelPensjonBeloep = 100000
  const inntektVsaHelPensjonSluttalder = 72

  const mockSimuleringsresultat = {
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

  describe('Gitt at alle parameterene til getChartOptions er angitt', () => {
    it('Burde alle chartOptions.series returneres', () => {
      const chartOptions = getChartOptions({
        simuleringsresultat: mockSimuleringsresultat,
        heltUttakAar,
        inntektVsaHelPensjonSluttalder,
        inntektVsaHelPensjonBeloep,
      })

      expect(chartOptions.chart.type).toBe('column')
      expect(chartOptions.title.text).toBe(
        'Beregnet framtidig alderspensjon (kroner per år):'
      )
      expect(chartOptions.xAxis.categories).toEqual([67, 68])
      expect(chartOptions.series).toEqual([
        { name: 'AFP Privat', data: [50000, 55000] },
        { name: 'Alderspensjon', data: [200000, 210000] },
        { name: 'Inntekt ved siden av hel pensjon', data: [100000, 100000] },
      ])
    })
    it('Burde filtrere kategorier med riktig belop i riktig intervall', () => {
      const chartOptions = getChartOptions({
        simuleringsresultat: mockSimuleringsresultat,
        heltUttakAar,
        inntektVsaHelPensjonSluttalder: 68,
        inntektVsaHelPensjonBeloep,
      })

      const filteredInntektVsaHelPensjonData = [100000, 100000]

      expect(chartOptions.series).toContainEqual({
        name: 'Inntekt ved siden av hel pensjon',
        data: filteredInntektVsaHelPensjonData,
      })
    })
  })

  describe('Gitt at det er udefinerte parametere i getChartOptions', () => {
    describe('Når inntekt vsa. helt uttak er undefined', () => {
      it('Burde ikke serien "Inntekt ved siden av hel pensjon" vises', () => {
        const chartOptions = getChartOptions({
          simuleringsresultat: mockSimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep: undefined,
        })

        expect(chartOptions.series).not.toContainEqual({
          name: 'Inntekt ved siden av hel pensjon',
          data: expect.any(Array),
        })
      })
    })

    describe('Når sluttalder for inntakt vsa. helt uttak er undefined', () => {
      it('Burde intervallet til beløpet være like langt som uttaksalderen (livsvarig inntekt)', () => {
        const chartOptions = getChartOptions({
          simuleringsresultat: mockSimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder: undefined,
          inntektVsaHelPensjonBeloep,
        })

        expect(chartOptions.series).toContainEqual({
          name: 'Inntekt ved siden av hel pensjon',
          data: [100000, 100000],
        })
      })
    })
    describe('Når afpPrivat er undefined', () => {
      it('Burde data for serien "AFP Privat" være tom', () => {
        const emptySimuleringsresultat = {
          alderspensjon: [
            { alder: 67, beloep: 200000 },
            { alder: 68, beloep: 210000 },
          ],
          afpPrivat: [],
          afpOffentlig: [],
          vilkaarsproeving: {
            vilkaarErOppfylt: false,
          },
        }

        const chartOptions = getChartOptions({
          simuleringsresultat: emptySimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
        })

        expect(chartOptions.xAxis.categories).toEqual([67, 68])
        expect(chartOptions.series).toEqual([
          { name: 'AFP Privat', data: [] },
          { name: 'Alderspensjon', data: [200000, 210000] },
          { name: 'Inntekt ved siden av hel pensjon', data: [100000, 100000] },
        ])
      })
    })
    describe('Når simuleringsresultat for alderspensjon er undefined', () => {
      it('Burde data for serien "Alderspensjon" være tom', () => {
        const emptySimuleringsresultat = {
          alderspensjon: [],
          afpPrivat: [
            { alder: 67, beloep: 50000 },
            { alder: 68, beloep: 55000 },
          ],
          afpOffentlig: [],
          vilkaarsproeving: {
            vilkaarErOppfylt: false,
          },
        }

        const chartOptions = getChartOptions({
          simuleringsresultat: emptySimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
        })

        expect(chartOptions.xAxis.categories).toEqual([])
        expect(chartOptions.series).toEqual([
          { name: 'AFP Privat', data: [50000, 55000] },
          { name: 'Alderspensjon', data: [] },
          { name: 'Inntekt ved siden av hel pensjon', data: [] },
        ])
      })
    })
    describe('Når simuleringsresultat er undefined', () => {
      it('Burde alle serier inneha tom data', () => {
        const chartOptions = getChartOptions({
          simuleringsresultat: undefined,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
        })

        expect(chartOptions.xAxis.categories).toEqual([])
        expect(chartOptions.series).toEqual([
          { name: 'AFP Privat', data: [] },
          { name: 'Alderspensjon', data: [] },
          { name: 'Inntekt ved siden av hel pensjon', data: [] },
        ])
      })
    })
  })
})
