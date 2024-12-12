import { useContext, useState } from 'react'
import { FormContext } from '@/contexts/context'
import { Simuleringsresultat } from '@/common'
import { ReadMore, Table } from '@navikt/ds-react'
import { formatInntekt, formatInntektToNumber } from './pages/utils/inntekt'
import stepStyles from './styles/stepStyles.module.css'

interface Props {
  simuleringsresultat?: Simuleringsresultat
}

const ResultTable: React.FC<Props> = ({ simuleringsresultat }) => {
  const { state } = useContext(FormContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const pensjonsalder = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.alder)
    : []

  const alderspensjonData = simuleringsresultat
    ? simuleringsresultat.alderspensjon.map((item) => item.beloep)
    : []

  const afpPrivatData = simuleringsresultat
    ? simuleringsresultat?.afpPrivat?.map((item) => item.beloep)
    : []

  const gradertUttaksalder = state.gradertUttak?.uttaksalder?.aar
  const heltUttakAar = state.heltUttak.uttaksalder.aar!
  const inntektVsaHelPensjonSluttalder =
    state.heltUttak.aarligInntektVsaPensjon?.sluttAlder?.aar

  const inntektVsaHelPensjonInterval: number[] = []
  const inntektVsaGradertUttakInterval: number[] = []
  if (gradertUttaksalder) {
    for (let i = gradertUttaksalder; i < heltUttakAar; i++) {
      inntektVsaGradertUttakInterval.push(i)
    }
  }

  const maxAar = inntektVsaHelPensjonSluttalder
    ? inntektVsaHelPensjonSluttalder
    : pensjonsalder[pensjonsalder.length - 1]

  for (let i = heltUttakAar; i <= maxAar; i++) {
    inntektVsaHelPensjonInterval.push(i)
  }

  const aarligbelopVsaGradertuttak = state.gradertUttak
    ?.aarligInntektVsaPensjonBeloep
    ? formatInntektToNumber(state.gradertUttak?.aarligInntektVsaPensjonBeloep)
    : 0
  const aarligbelopVsaHeltuttak = state.heltUttak?.aarligInntektVsaPensjon
    ?.beloep
    ? formatInntektToNumber(state.heltUttak?.aarligInntektVsaPensjon?.beloep)
    : 0

  return (
    <ReadMore
      data-testid="show-result-table"
      header={
        isOpen ? 'Lukk tabell av beregningen' : 'Vis tabell av beregningen'
      }
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={stepStyles.tabellScrollbarhet}>
        <Table data-testid="result-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Alder</Table.HeaderCell>
              <Table.HeaderCell scope="col">
                Alderspensjon (Nav)
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">AFP privat</Table.HeaderCell>
              <Table.HeaderCell scope="col">
                Pensjonsgivende inntekt
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">Sum</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell scope="row">
                {pensjonsalder.length > 0 ? `${pensjonsalder[0] - 1} år` : 0}
              </Table.HeaderCell>
              <Table.DataCell>0</Table.DataCell>
              <Table.DataCell>0</Table.DataCell>
              <Table.DataCell>
                {state.aarligInntektFoerUttakBeloep}
              </Table.DataCell>
              <Table.DataCell>
                {state.aarligInntektFoerUttakBeloep}
              </Table.DataCell>
            </Table.Row>
            {pensjonsalder.map((alder, index) => (
              <Table.Row key={index}>
                <Table.HeaderCell scope="row">
                  {pensjonsalder.length - 1 === index
                    ? `${alder}+ år (livsvarig)`
                    : `${alder} år`}
                </Table.HeaderCell>
                <Table.DataCell>
                  {formatInntekt(alderspensjonData[index])}
                </Table.DataCell>
                <Table.DataCell>
                  {afpPrivatData!.length > 0
                    ? formatInntekt(afpPrivatData![index]) ||
                      formatInntekt(afpPrivatData![afpPrivatData!.length - 1])
                    : 0}
                </Table.DataCell>
                <Table.DataCell>
                  {inntektVsaGradertUttakInterval.includes(alder)
                    ? formatInntekt(aarligbelopVsaGradertuttak)
                    : inntektVsaHelPensjonInterval.includes(alder)
                      ? formatInntekt(aarligbelopVsaHeltuttak)
                      : 0}
                </Table.DataCell>
                <Table.DataCell>
                  {formatInntekt(
                    alderspensjonData[index] +
                      ((afpPrivatData ? afpPrivatData[index] : 0) || 0) +
                      (inntektVsaGradertUttakInterval.includes(alder)
                        ? aarligbelopVsaGradertuttak
                        : inntektVsaHelPensjonInterval.includes(alder)
                          ? aarligbelopVsaHeltuttak
                          : 0)
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </ReadMore>
  )
}

export default ResultTable
