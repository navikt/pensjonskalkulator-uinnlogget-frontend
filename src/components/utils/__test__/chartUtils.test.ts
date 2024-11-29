import { getChartOptions } from '../chartUtils'

describe('getChartOptions', () => {
  const heltUttakAar = 67
  const inntektVsaHelPensjonBeloep = 100000
  const inntektVsaHelPensjonSluttalder = 68
  const aarligInntektFoerUttakBeloep = 500000
  const gradertUttakAlder = 65
  const gradertUttakInntekt = 200000

  const mockSimuleringsresultat = {
    alderspensjon: [
      { alder: 65, beloep: 180000 },
      { alder: 66, beloep: 190000 },
      { alder: 67, beloep: 200000 },
      { alder: 68, beloep: 210000 },
    ],
    afpPrivat: [
      { alder: 65, beloep: 40000 },
      { alder: 66, beloep: 45000 },
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
        aarligInntektFoerUttakBeloep,
        gradertUttakAlder,
        gradertUttakInntekt,
      })

      expect(chartOptions.chart.type).toBe('column')
      expect(chartOptions.title.text).toBe(
        'Beregnet framtidig alderspensjon (kroner per år):'
      )
      expect(chartOptions.xAxis.categories).toEqual([64, 65, 66, 67, 68])
      expect(chartOptions.series).toEqual([
        {
          name: 'AFP Privat',
          data: [null, 40000, 45000, 50000, 55000],
          color: 'var(--a-purple-400)',
        },
        {
          name: 'Pensjonsgivende inntekt',
          data: [500000, null, null, null, null],
          color: 'var(--a-gray-500)',
        },
        {
          name: 'Alderspensjon',
          data: [null, 180000, 190000, 200000, 210000],
          color: 'var(--a-deepblue-500)',
        },
        {
          name: 'Inntekt ved siden av hel pensjon',
          data: [null, null, null, 100000, 100000],
          color: 'var(--a-green-400)',
        },
        {
          name: 'Inntekt ved siden av gradert pensjon',
          data: [null, 200000, 200000, null, null],
          color: 'var(--a-gray-500)',
        },
      ])
    })
    it('Burde filtrere kategorier med riktig belop i riktig intervall', () => {
      const chartOptions = getChartOptions({
        simuleringsresultat: mockSimuleringsresultat,
        heltUttakAar,
        inntektVsaHelPensjonSluttalder,
        inntektVsaHelPensjonBeloep,
        aarligInntektFoerUttakBeloep,
        gradertUttakAlder,
        gradertUttakInntekt,
      })

      const filteredInntektVsaHelPensjonData = [
        null,
        null,
        null,
        100000,
        100000,
      ]

      expect(chartOptions.series).toContainEqual({
        name: 'Inntekt ved siden av hel pensjon',
        data: filteredInntektVsaHelPensjonData,
        color: 'var(--a-green-400)',
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
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder,
          gradertUttakInntekt,
        })

        expect(chartOptions.series).toContainEqual({
          name: 'Inntekt ved siden av hel pensjon',
          data: [null, null, null, 100000, 100000],
          color: 'var(--a-green-400)',
        })
      })
    })
    describe('Når afpPrivat er tom', () => {
      it('Burde data for serien "AFP Privat" være tom', () => {
        const emptySimuleringsresultat = {
          ...mockSimuleringsresultat,
          afpPrivat: [],
        }

        const chartOptions = getChartOptions({
          simuleringsresultat: emptySimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder,
          gradertUttakInntekt,
        })

        expect(chartOptions.xAxis.categories).toEqual([64, 65, 66, 67, 68])
        expect(chartOptions.series).toEqual([
          {
            name: 'Pensjonsgivende inntekt',
            data: [500000, null, null, null, null],
            color: 'var(--a-gray-500)',
          },
          {
            name: 'Alderspensjon',
            data: [null, 180000, 190000, 200000, 210000],
            color: 'var(--a-deepblue-500)',
          },
          {
            name: 'Inntekt ved siden av hel pensjon',
            data: [null, null, null, 100000, 100000],
            color: 'var(--a-green-400)',
          },
          {
            name: 'Inntekt ved siden av gradert pensjon',
            data: [null, 200000, 200000, null, null],
            color: 'var(--a-gray-500)',
          },
        ])
      })
    })
    describe('Når simuleringsresultat for alderspensjon er tom', () => {
      it('Burde data for serien "Alderspensjon" være tom', () => {
        const emptySimuleringsresultat = {
          ...mockSimuleringsresultat,
          alderspensjon: [],
        }

        const chartOptions = getChartOptions({
          simuleringsresultat: emptySimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder: 0,
          gradertUttakInntekt: 0,
        })

        expect(chartOptions.xAxis.categories).toEqual([])
        expect(chartOptions.series).toEqual([
          {
            name: 'AFP Privat',
            data: [null, 40000, 45000, 50000, 55000],
            color: 'var(--a-purple-400)',
          },
          {
            name: 'Pensjonsgivende inntekt',
            data: [500000],
            color: 'var(--a-gray-500)',
          },
          {
            name: 'Alderspensjon',
            data: [null],
            color: 'var(--a-deepblue-500)',
          },
          {
            name: 'Inntekt ved siden av hel pensjon',
            data: [null],
            color: 'var(--a-green-400)',
          },
        ])
      })
    })
    describe('Når simuleringsresultat er undefined', () => {
      it('Burde seriene inneholde riktig data', () => {
        const chartOptions = getChartOptions({
          simuleringsresultat: undefined,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder,
          gradertUttakInntekt,
        })

        expect(chartOptions.xAxis.categories).toEqual([])
        expect(chartOptions.series).toEqual([
          {
            name: 'Pensjonsgivende inntekt',
            data: [500000],
            color: 'var(--a-gray-500)',
          },
          {
            name: 'Alderspensjon',
            data: [null],
            color: 'var(--a-deepblue-500)',
          },
          {
            name: 'Inntekt ved siden av hel pensjon',
            data: [null],
            color: 'var(--a-green-400)',
          },
          {
            name: 'Inntekt ved siden av gradert pensjon',
            data: [null],
            color: 'var(--a-gray-500)',
          },
        ])
      })
    })
  })
})
