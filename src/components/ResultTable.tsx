import { useState } from 'react'
import { Simuleringsresultat } from '@/common'
import { ReadMore, Table } from '@navikt/ds-react'
import { formatInntekt } from './pages/utils/inntekt'
import stepStyles from './styles/stepStyles.module.css'
import { useSimuleringsresultatData } from './utils/useSimuleringsresultatData'

interface Props {
  simuleringsresultat?: Simuleringsresultat
}

const ResultTable: React.FC<Props> = ({ simuleringsresultat }) => {
  const {
    state,
    pensjonsalder,
    alderspensjonData,
    afpPrivatValue,
    inntektVsaPensjonValue,
    sum,
  } = useSimuleringsresultatData(simuleringsresultat)
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
              <Table.HeaderCell
                scope="col"
                className={stepStyles.tableMobileOnly}
              />
              <Table.HeaderCell scope="col">Alder</Table.HeaderCell>
              <Table.HeaderCell
                scope="col"
                align="right"
                className={stepStyles.tableDesktopOnly}
              >
                Alderspensjon (Nav)
              </Table.HeaderCell>
              <Table.HeaderCell
                scope="col"
                align="right"
                className={stepStyles.tableDesktopOnly}
              >
                AFP privat
              </Table.HeaderCell>
              <Table.HeaderCell
                scope="col"
                align="right"
                className={stepStyles.tableDesktopOnly}
              >
                Pensjonsgivende inntekt
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                Sum
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className={stepStyles.tableDesktopOnly}>
            <Table.Row>
              <Table.HeaderCell scope="row">
                {pensjonsalder.length > 0 ? `${pensjonsalder[0] - 1} år` : 0}
              </Table.HeaderCell>
              <Table.DataCell align="right">0</Table.DataCell>
              <Table.DataCell align="right">0</Table.DataCell>
              <Table.DataCell align="right">
                {state.aarligInntektFoerUttakBeloep}
              </Table.DataCell>
              <Table.DataCell align="right">
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
                <Table.DataCell align="right">
                  {formatInntekt(alderspensjonData[index])}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {formatInntekt(afpPrivatValue(index))}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {formatInntekt(inntektVsaPensjonValue(alder))}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {formatInntekt(sum(index, alder))}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Body className={stepStyles.tableMobileOnly}>
            <Table.ExpandableRow
              content={
                <dl className={stepStyles.details}>
                  <dt>Alderspensjon (Nav)</dt>
                  <dd className={stepStyles.detailsItemRight}>0</dd>
                  <dt>AFP privat</dt>
                  <dd className={stepStyles.detailsItemRight}>0</dd>
                  <dt>Pensjonsgivende inntekt</dt>
                  <dd className={stepStyles.detailsItemRight}>
                    {state.aarligInntektFoerUttakBeloep}
                  </dd>
                </dl>
              }
              expandOnRowClick
            >
              <Table.DataCell scope="row">
                {pensjonsalder.length > 0 ? `${pensjonsalder[0] - 1} år` : 0}
              </Table.DataCell>
              <Table.DataCell
                align="right"
                className={stepStyles.detailsItemBold}
              >
                <span>{state.aarligInntektFoerUttakBeloep}</span>
              </Table.DataCell>
            </Table.ExpandableRow>
            {pensjonsalder.map((alder, index) => {
              const detaljertGrid = (
                <dl key={index} className={stepStyles.details}>
                  <dt>Alderspensjon (Nav)</dt>
                  <dd className={stepStyles.detailsItemRight}>
                    {formatInntekt(alderspensjonData[index])}
                  </dd>
                  <dt>AFP privat</dt>
                  <dd className={stepStyles.detailsItemRight}>
                    {formatInntekt(afpPrivatValue(index))}
                  </dd>
                  <dt>Pensjonsgivende inntekt</dt>
                  <dd className={stepStyles.detailsItemRight}>
                    {formatInntekt(inntektVsaPensjonValue(alder))}
                  </dd>
                </dl>
              )

              return (
                <Table.ExpandableRow
                  key={index}
                  content={detaljertGrid}
                  expandOnRowClick
                >
                  <Table.DataCell scope="row">
                    {pensjonsalder.length - 1 === index
                      ? `${alder}+ år (livsvarig)`
                      : `${alder} år`}
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    {formatInntekt(sum(index, alder))}
                  </Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    </ReadMore>
  )
}

export default ResultTable
