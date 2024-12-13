import { formatInntektToNumber } from '@/components/pages/utils/inntekt'
import { alignData, getChartOptions } from '../chartUtils'

describe('getChartOptions', () => {
  const heltUttakAar = 67
  const inntektVsaHelPensjonBeloep = '100000'
  const inntektVsaHelPensjonSluttalder = 68
  const aarligInntektFoerUttakBeloep = '500000'
  const gradertUttakAlder = 65
  const gradertUttakInntekt = '200000'

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
      expect(chartOptions.xAxis.categories).toEqual([64, 65, 66, 67, '68+'])
      expect(chartOptions.series).toEqual([
        {
          name: 'AFP Privat',
          data: [null, 40000, 45000, 50000, 55000],
          color: 'var(--a-purple-400)',
        },
        {
          name: 'Pensjonsgivende inntekt',
          data: [500000, 200000, 200000, 100000, 100000],
          color: 'var(--a-gray-500)',
        },
        {
          name: 'Alderspensjon',
          data: [null, 180000, 190000, 200000, 210000],
          color: 'var(--a-deepblue-500)',
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
        500000, 200000, 200000, 100000, 100000,
      ]

      expect(chartOptions.series).toContainEqual({
        name: 'Pensjonsgivende inntekt',
        data: filteredInntektVsaHelPensjonData,
        color: 'var(--a-gray-500)',
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
      describe('Når inntektVsaHelPensjonBeloep, aarligInntektFoerUttakBeloep og gradertUttakInntekt ikke kan parses til number', () => {
        it('Burde seriene for "Pensjonsgivende inntekt" inneholde', () => {
          const chartOptions = getChartOptions({
            simuleringsresultat: mockSimuleringsresultat,
            heltUttakAar,
            inntektVsaHelPensjonSluttalder,
            inntektVsaHelPensjonBeloep: 'NaN',
            aarligInntektFoerUttakBeloep: 'NaN',
            gradertUttakAlder,
            gradertUttakInntekt: 'NaN',
          })

          expect(chartOptions.series).toContainEqual({
            name: 'Pensjonsgivende inntekt',
            data: [0, null, null, null, null],
            color: 'var(--a-gray-500)',
          })
        })
      })
    })

    describe('Når gradert uttak er definert', () => {
      it('Burde serien for "Pensjonsgivende" inntekt oppdateres', () => {
        const chartOptions = getChartOptions({
          simuleringsresultat: mockSimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder: undefined,
          inntektVsaHelPensjonBeloep,
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder,
          gradertUttakInntekt,
        })

        chartOptions.series[1].data = [null, null, null, null, null]

        const gradertUttakInterval = []
        for (let i = gradertUttakAlder; i < heltUttakAar; i++) {
          gradertUttakInterval.push(i)
        }

        const parsedGradertUttakInntekt = isNaN(
          formatInntektToNumber(gradertUttakInntekt)
        )
          ? 0
          : formatInntektToNumber(gradertUttakInntekt)

        const alignedGradertUttakData = alignData(
          [64, 65, 66, 67, 68],
          gradertUttakInterval,
          parsedGradertUttakInntekt
        )

        chartOptions.series[1].data = chartOptions.series[1].data.map(
          (value, index) =>
            value !== null ? value : (alignedGradertUttakData[index] ?? value)
        )

        expect(chartOptions.series[1].data).toEqual([
          null,
          200000,
          200000,
          null,
          null,
        ])
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
          name: 'Pensjonsgivende inntekt',
          data: [500000, 200000, 200000, 100000, 100000],
          color: 'var(--a-gray-500)',
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

        expect(chartOptions.xAxis.categories).toEqual([64, 65, 66, 67, '68+'])
        expect(chartOptions.series).toEqual([
          {
            name: 'Pensjonsgivende inntekt',
            data: [500000, 200000, 200000, 100000, 100000],
            color: 'var(--a-gray-500)',
          },
          {
            name: 'Alderspensjon',
            data: [null, 180000, 190000, 200000, 210000],
            color: 'var(--a-deepblue-500)',
          },
        ])
      })
    })
    describe('Når det mangles data for afpPrivat ', () => {
      it('Burde manglende data for serien "AFP Privat" fylles med siste verdi', () => {
        const missingDataSimuleringsresultat = {
          ...mockSimuleringsresultat,
          afpPrivat: [
            { alder: 65, beloep: 40000 },
            { alder: 66, beloep: 45000 },
          ],
        }

        const chartOptions = getChartOptions({
          simuleringsresultat: missingDataSimuleringsresultat,
          heltUttakAar,
          inntektVsaHelPensjonSluttalder,
          inntektVsaHelPensjonBeloep,
          aarligInntektFoerUttakBeloep,
          gradertUttakAlder,
          gradertUttakInntekt,
        })

        expect(chartOptions.xAxis.categories).toEqual([64, 65, 66, 67, '68+'])
        expect(chartOptions.series).toEqual([
          {
            name: 'AFP Privat',
            data: [null, 40000, 45000, 45000, 45000],
            color: 'var(--a-purple-400)',
          },
          {
            name: 'Pensjonsgivende inntekt',
            data: [500000, 200000, 200000, 100000, 100000],
            color: 'var(--a-gray-500)',
          },
          {
            name: 'Alderspensjon',
            data: [null, 180000, 190000, 200000, 210000],
            color: 'var(--a-deepblue-500)',
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
          gradertUttakInntekt,
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
        ])
      })
    })
  })
})
