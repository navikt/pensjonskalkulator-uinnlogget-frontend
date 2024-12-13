import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
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
  goTo: jest.fn(),
  handleSubmit: jest.fn(),
  goToNext: mockGoToNext,
}

const mockContextValue = {
  state: {
    ...initialState,
    aarligInntektFoerUttakBeloep: '500000',
    gradertUttak: {
      grad: 50,
      uttaksalder: { aar: 67, maaneder: 0 },
      aarligInntektVsaPensjonBeloep: '50000',
    },
    heltUttak: {
      uttaksalder: { aar: 68, maaneder: 0 },
      aarligInntektVsaPensjon: {
        beloep: '100000',
        sluttAlder: { aar: 68, maaneder: 0 },
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
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )
    fireEvent.click(screen.getByTestId('show-result-table'))
    expect(screen.getByTestId('result-table')).toBeInTheDocument()
  })

  test('Burde rendre tabell dersom vi ikke har et simuleringsresultat', () => {
    const mockSimuleringsresultatEmpty = undefined

    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable simuleringsresultat={mockSimuleringsresultatEmpty} />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))
    expect(screen.getByTestId('result-table')).toBeInTheDocument()
  })

  test('Burde vise riktig antall rows', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )
    fireEvent.click(screen.getByTestId('show-result-table'))
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(4) // 1 header row + 3 data rows
  })

  test('Burde vise headers med riktig tittel', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )
    fireEvent.click(screen.getByTestId('show-result-table'))
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(5)
    expect(headers[0]).toHaveTextContent('Alder')
    expect(headers[1]).toHaveTextContent('Alderspensjon (Nav)')
    expect(headers[2]).toHaveTextContent('AFP privat')
    expect(headers[3]).toHaveTextContent('Pensjonsgivende inntekt')
    expect(headers[4]).toHaveTextContent('Sum')
  })

  test('Burde vise riktig alderspensjon data for helt uttak', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))
    const rows = screen.getAllByRole('row')

    const heltRow = rows[3]
    expect(heltRow).toHaveTextContent('68+ år (livsvarig)')
    expect(heltRow).toHaveTextContent('210 000')
    expect(heltRow).toHaveTextContent('55 000')
    expect(heltRow).toHaveTextContent('100 000')
    expect(heltRow).toHaveTextContent('365 000')
  })

  test('Burde vise riktig alderspensjon data for gradert uttak', () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))
    const rows = screen.getAllByRole('row')

    const gradertRow = rows[2]
    expect(gradertRow).toHaveTextContent('67 år')
    expect(gradertRow).toHaveTextContent('200 000')
    expect(gradertRow).toHaveTextContent('50 000')
    expect(gradertRow).toHaveTextContent('50 000')
    expect(gradertRow).toHaveTextContent('300 000')
  })

  test('Burde sette rendre tabellen med riktige verdier dersom gradert uttak er undefined', () => {
    const mockContextValueWithoutGradertUttak = {
      ...mockContextValue,
      state: {
        ...mockContextValue.state,
        gradertUttak: undefined,
      },
    }

    render(
      <FormContext.Provider value={mockContextValueWithoutGradertUttak}>
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(4)

    const gradertRow = rows[2]
    expect(gradertRow).toHaveTextContent('67 år')
    expect(gradertRow).toHaveTextContent('200 000')
    expect(gradertRow).toHaveTextContent('50 000')
    expect(gradertRow).toHaveTextContent('0')
    expect(gradertRow).toHaveTextContent('250 000')

    const heltRow = rows[3]
    expect(heltRow).toHaveTextContent('68+ år (livsvarig)')
    expect(heltRow).toHaveTextContent('210 000')
    expect(heltRow).toHaveTextContent('55 000')
    expect(heltRow).toHaveTextContent('100 000')
    expect(heltRow).toHaveTextContent('365 000')
  })

  test('Burde sette riktig sluttalder for inntekt vsa. hel pensjon som ikke er livsvarig', () => {
    const mockExtendedSimuleringsresultat = {
      ...mockSimuleringsresultat,
      alderspensjon: [
        { alder: 67, beloep: 200000 },
        { alder: 68, beloep: 210000 },
        { alder: 69, beloep: 220000 },
      ],
    }
    const mockContextValueMedSluttalder = {
      ...mockContextValue,
      state: {
        ...initialState,
        gradertUttak: undefined,
        heltUttak: {
          uttaksalder: { aar: 67, maaneder: 0 },
          aarligInntektVsaPensjon: {
            beloep: '100000',
            sluttAlder: { aar: 68, maaneder: 0 },
          },
        },
      },
    }
    render(
      <FormContext.Provider value={mockContextValueMedSluttalder}>
        <ResultTable simuleringsresultat={mockExtendedSimuleringsresultat} />
      </FormContext.Provider>
    )
    fireEvent.click(screen.getByTestId('show-result-table'))

    const maxAar =
      mockContextValueMedSluttalder.state.heltUttak.aarligInntektVsaPensjon
        .sluttAlder.aar
    expect(maxAar).toBe(68)

    const rows = screen.getAllByRole('row')
    const row69 = rows.find((row) => row.textContent?.includes('69'))
    const cells = row69?.querySelectorAll('td')
    const cell69 = cells ? cells[2] : null
    expect(cell69).toHaveTextContent('0')
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
        <ResultTable simuleringsresultat={mockSimuleringsresultat} />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))

    const rows = screen.getAllByRole('row')

    const heltRow = rows[3]
    expect(heltRow).toHaveTextContent('68+ år (livsvarig)')
    expect(heltRow).toHaveTextContent('210 000')
    expect(heltRow).toHaveTextContent('55 000')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('265 000')
  })

  test('Burde visningen for AFP Privat settes til 0 hvis vi ikke har data for afpPrivat', () => {
    const mockSimuleringsresultatWithoutAfpPrivat = {
      ...mockSimuleringsresultat,
      afpPrivat: undefined,
    }
    render(
      <FormContext.Provider value={mockContextValue}>
        <ResultTable
          simuleringsresultat={mockSimuleringsresultatWithoutAfpPrivat}
        />
      </FormContext.Provider>
    )

    fireEvent.click(screen.getByTestId('show-result-table'))

    const rows = screen.getAllByRole('row')

    const inntektRow = rows[1]
    expect(inntektRow).toHaveTextContent('66 år')
    expect(inntektRow).toHaveTextContent('0')
    expect(inntektRow).toHaveTextContent('0')
    expect(inntektRow).toHaveTextContent('500000')
    expect(inntektRow).toHaveTextContent('500000')

    const gradertRow = rows[2]
    expect(gradertRow).toHaveTextContent('67 år')
    expect(gradertRow).toHaveTextContent('200 000')
    expect(gradertRow).toHaveTextContent('0')
    expect(gradertRow).toHaveTextContent('50 000')
    expect(gradertRow).toHaveTextContent('250 000')

    const heltRow = rows[3]
    expect(heltRow).toHaveTextContent('68+ år (livsvarig)')
    expect(heltRow).toHaveTextContent('210 000')
    expect(heltRow).toHaveTextContent('0')
    expect(heltRow).toHaveTextContent('100 000')
    expect(heltRow).toHaveTextContent('310 000')
  })
})
