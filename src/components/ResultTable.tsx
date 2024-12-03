import { useContext } from 'react'
import { FormContext } from '@/contexts/context'
import { Simuleringsresultat } from '@/common'
import { ReadMore, Table } from '@navikt/ds-react'

interface Props {
  simuleringsresultat?: Simuleringsresultat
}

const ResultTable: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state } = useContext(FormContext)

  const pensjonsalder = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []

  const afpPrivatData = simuleringsresultat
    ? simuleringsresultat?.afpPrivat?.map((item) => item.beloep)
    : []

  const gradertUttakAlder = state.gradertUttak?.uttaksalder?.aar
  const heltUttakAar = state.heltUttak?.uttaksalder?.aar
  const inntektVsaHelPensjonSluttalder =
    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar

  const inntektVsaHelPensjonInterval: number[] = []
  const inntektVsaGradertUttakInterval: number[] = []
  if (gradertUttakAlder && heltUttakAar) {
    for (let i = gradertUttakAlder; i < heltUttakAar; i++) {
      inntektVsaGradertUttakInterval.push(i)
    }

    const maxAar = inntektVsaHelPensjonSluttalder
      ? inntektVsaHelPensjonSluttalder
      : pensjonsalder[pensjonsalder.length - 1]

    for (let i = heltUttakAar; i <= maxAar; i++) {
      inntektVsaHelPensjonInterval.push(i)
    }
  }

  const aarligbelopVsaGradertuttak = state.gradertUttak
    ?.aarligInntektVsaPensjonBeloep
    ? parseInt(state.gradertUttak?.aarligInntektVsaPensjonBeloep)
    : 0
  const aarligbelopVsaHeltuttak = state.heltUttak?.aarligInntektVsaPensjon
    ?.beloep
    ? parseInt(state.heltUttak?.aarligInntektVsaPensjon?.beloep)
    : 0

  return (
    <ReadMore data-testid="show-result-table" header="Tabell">
      <Table data-testid="result-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Alder og uttaksgrad</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra folketrygden</Table.HeaderCell>
            <Table.HeaderCell scope="col">AFP privat</Table.HeaderCell>
            <Table.HeaderCell scope="col">Arbeidsinntekt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sum</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pensjonsalder.map((alder, index) => (
            <Table.Row key={index}>
              <Table.DataCell>{alder}</Table.DataCell>
              <Table.DataCell>{alderspensjonData[index]}</Table.DataCell>
              <Table.DataCell>
                {(afpPrivatData ? afpPrivatData[index] : 0) || 0}
              </Table.DataCell>
              <Table.DataCell>
                {inntektVsaGradertUttakInterval.includes(alder)
                  ? aarligbelopVsaGradertuttak
                  : inntektVsaHelPensjonInterval.includes(alder)
                    ? aarligbelopVsaHeltuttak
                    : 0}
              </Table.DataCell>
              <Table.DataCell>
                {alderspensjonData[index] +
                  ((afpPrivatData ? afpPrivatData[index] : 0) || 0) +
                  (inntektVsaGradertUttakInterval.includes(alder)
                    ? aarligbelopVsaGradertuttak
                    : inntektVsaHelPensjonInterval.includes(alder)
                      ? aarligbelopVsaHeltuttak
                      : 0)}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ReadMore>
  )
}

export default ResultTable
