import { getChartOptions } from '../chartUtils'

describe('getChartOptions', () => {
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

  describe('Gitt at alle parameterene til getChartOptions er angitt', () => {
    it('Burde alle chartOptions.series returneres', () => {
      const heltUttakAlder = 67
      const inntektVsaHelPensjonBeloep = 100000
      const inntektVsaHelPensjonSluttalder = 72

      const chartOptions = getChartOptions(
        heltUttakAlder,
        inntektVsaHelPensjonSluttalder,
        inntektVsaHelPensjonBeloep,
        mockBeregnResult
      )

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
      const heltUttakAlder = 67
      const inntektVsaHelPensjonSluttalder = 68
      const inntektVsaHelPensjonBeloep = 100000

      const chartOptions = getChartOptions(
        heltUttakAlder,
        inntektVsaHelPensjonSluttalder,
        inntektVsaHelPensjonBeloep,
        mockBeregnResult
      )

      const filteredInntektVsaHelPensjonData = [100000, 100000]

      expect(chartOptions.series).toContainEqual({
        name: 'Inntekt ved siden av hel pensjon',
        data: filteredInntektVsaHelPensjonData,
      })
    })
  })

  describe('Gitt at det er udefinerte parametere i getChartOptions', () => {
    describe('Når inntektVsaHelPensjonBeloep er 0', () => {
      it('Burde ikke serien "Inntekt ved siden av hel pensjon" vises', () => {
        const heltUttakAlder = 67
        const inntektVsaHelPensjonSluttalder = 72
        const inntektVsaHelPensjonBeloep = 0

        const chartOptions = getChartOptions(
          heltUttakAlder,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          mockBeregnResult
        )

        expect(chartOptions.series).not.toContainEqual({
          name: 'Inntekt ved siden av hel pensjon',
          data: expect.any(Array),
        })
      })
    })

    describe('Når inntektVsaHelPensjonSluttalder 0', () => {
      it('Burde intervallet til beløpet være like langt som alderspensjon.alder (livsvarig inntekt)', () => {
        const heltUttakAlder = 67
        const inntektVsaHelPensjonSluttalder = 0
        const inntektVsaHelPensjonBeloep = 100000

        const chartOptions = getChartOptions(
          heltUttakAlder,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          mockBeregnResult
        )

        expect(chartOptions.series).toContainEqual({
          name: 'Inntekt ved siden av hel pensjon',
          data: [100000, 100000],
        })
      })
    })
    describe('Når beregnResult.afpPrivat er undefined', () => {
      it('Burde data for serien "AFP Privat" være tom', () => {
        const heltUttakAlder = 67
        const inntektVsaHelPensjonSluttalder = 72
        const inntektVsaHelPensjonBeloep = 100000
        const emptyBeregnResult = {
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

        const chartOptions = getChartOptions(
          heltUttakAlder,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          emptyBeregnResult
        )

        expect(chartOptions.xAxis.categories).toEqual([67, 68])
        expect(chartOptions.series).toEqual([
          { name: 'AFP Privat', data: [] },
          { name: 'Alderspensjon', data: [200000, 210000] },
          { name: 'Inntekt ved siden av hel pensjon', data: [100000, 100000] },
        ])
      })
    })
    describe('Når beregnResult.alderspensjon er undefined', () => {
      it('Burde data for serien "AldersPensjon" være tom', () => {
        const heltUttakAlder = 67
        const inntektVsaHelPensjonSluttalder = 72
        const inntektVsaHelPensjonBeloep = 100000
        const emptyBeregnResult = {
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

        const chartOptions = getChartOptions(
          heltUttakAlder,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          emptyBeregnResult
        )

        expect(chartOptions.xAxis.categories).toEqual([])
        expect(chartOptions.series).toEqual([
          { name: 'AFP Privat', data: [50000, 55000] },
          { name: 'Alderspensjon', data: [] },
          { name: 'Inntekt ved siden av hel pensjon', data: [] },
        ])
      })
    })
    describe('Når beregnResult er undefined', () => {
      it('Burde alle serier inneha tom data', () => {
        const heltUttakAlder = 67
        const inntektVsaHelPensjonSluttalder = 72
        const inntektVsaHelPensjonBeloep = 100000
        const undefinedBeregnResult = undefined

        const chartOptions = getChartOptions(
          heltUttakAlder,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          undefinedBeregnResult
        )

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
