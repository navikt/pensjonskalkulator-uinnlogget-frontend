import React from 'react'
import { render, screen } from '@testing-library/react'
import ResultTable from '../ResultTable'
import { FormContext } from '@/contexts/context'
import { initialState } from '@/defaults/initialState'

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

const mockGoToNext = jest.fn()
const mockSetState = jest.fn()

const defaultFormPageProps = {
  curStep: 1,
  length: 5,
  goBack: jest.fn(),
  onStepChange: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: {
    ...initialState,
    gradertUttak: {
      grad: 50,
      uttakAlder: { aar: 67, maaneder: 0 },
      aarligInntektVsaPensjonBeloep: 50000,
    },
    heltUttak: {
      uttakAlder: { aar: 68, maaneder: 0 },
      aarligInntektVsaPensjon: {
        beloep: 100000,
        sluttAlder: { aar: null, maaneder: null },
      },
    },
  },
  setState: mockSetState,
  formPageProps: defaultFormPageProps,
}

describe('ResultTable Component', () => {
  test('Burde rendre tabllen uten crash', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )
    expect(screen.getByTestId('result-table')).toBeInTheDocument()
  })

  test('Burde vise riktig antall rows', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3) // 1 header row + 2 data rows
  })

  test('Burde vise headers med riktig tittel', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent('Alder og uttaksgrad')
    expect(headers[1]).toHaveTextContent('Fra folketrygden')
    expect(headers[2]).toHaveTextContent('AFP privat')
    expect(headers[3]).toHaveTextContent('Arbeidsinntekt')
    expect(headers[4]).toHaveTextContent('Sum')
  })

  test('Burde vise riktig alderspensjon data for helt uttak', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')

    const heltRow = rows[2]
    expect(heltRow).toHaveTextContent('Ved 68 (100 %)')
    expect(heltRow).toHaveTextContent('210000')
    expect(heltRow).toHaveTextContent('55000')
    expect(heltRow).toHaveTextContent('100000')
    expect(heltRow).toHaveTextContent('365000')
  })

  test('Burde vise riktig alderspensjon data for gradert uttak', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')

    const gradertRow = rows[1]
    expect(gradertRow).toHaveTextContent('Ved 67 (50 %)')
    expect(gradertRow).toHaveTextContent('200000')
    expect(gradertRow).toHaveTextContent('50000')
    expect(gradertRow).toHaveTextContent('50000')
    expect(gradertRow).toHaveTextContent('300000')
  })

  test('Burde ikke vise tabell rad for gradert uttak hvis gradertUttak er undefined', () => {
    const mockContextValueWithoutGradertUttak = {
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        gradertUttak: undefined,
      },
    }

    render(
      <FormContext.Provider value={mockContextValueWithoutGradertUttak}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2) // 1 header row + 1 data row, ingen for gradert uttak
  })

  test('Burde sette aarligbelopVsaHeltuttak til 0 hvis aarligInntektVsaPensjon er undefined', () => {
    const mockContextValueWithoutAarligInntektVsaPensjon = {
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        heltUttak: {
          ...mockContextValue.state.heltUttak,
          aarligInntektVsaPensjon: undefined,
        },
      },
    }

    render(
      <FormContext.Provider
        value={mockContextValueWithoutAarligInntektVsaPensjon}
      >
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={mockSimuleringsresultat.afpPrivat}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')

    const heltRow = rows[2]
    expect(heltRow).toHaveTextContent('Ved 68 (100 %)')
    expect(heltRow).toHaveTextContent('210000')
    expect(heltRow).toHaveTextContent('55000')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('265000')
  })

  test('Burde sette afpPrivatHel og afpPrivatGradert til 0 hvis afpPrivat er undefined', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultat.alderspensjon}
          afpPrivat={undefined}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')

    const gradertRow = rows[1]
    expect(gradertRow).toHaveTextContent('Ved 67 (50 %)')
    expect(gradertRow).toHaveTextContent('200000')
    expect(gradertRow).toHaveTextContent('0')
    expect(gradertRow).toHaveTextContent('50000')
    expect(gradertRow).toHaveTextContent('250000')

    const heltRow = rows[2]
    expect(heltRow).toHaveTextContent('Ved 68 (100 %)')
    expect(heltRow).toHaveTextContent('210000')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('100000')
    expect(heltRow).toHaveTextContent('310000')
  })

  test('Burde vise fallback verdier til alderspensjon og afpPrivat når ingen matchende elementer finnes', () => {
    const mockSimuleringsresultatEmpty = {
      alderspensjon: [],
      afpPrivat: [],
      afpOffentlig: [],
      vilkaarsproeving: {
        vilkaarErOppfylt: true,
      },
    }

    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          alderspensjon={mockSimuleringsresultatEmpty.alderspensjon}
          afpPrivat={mockSimuleringsresultatEmpty.afpPrivat}
        />
      </FormContext.Provider>
    )

    const rows = screen.getAllByRole('row')

    const heltRow = rows[2]
    expect(heltRow).toHaveTextContent('Ved 68 (100 %)')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('100000')
    expect(heltRow).toHaveTextContent('100000')

    const gradertRow = rows[1]
    expect(gradertRow).toHaveTextContent('Ved 67 (50 %)')
    expect(gradertRow).toHaveTextContent('0')
    expect(gradertRow).toHaveTextContent('0')
    expect(gradertRow).toHaveTextContent('50000')
    expect(gradertRow).toHaveTextContent('50000')
  })
})
