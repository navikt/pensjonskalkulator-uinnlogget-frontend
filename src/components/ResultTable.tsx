import { useContext, useMemo } from 'react'
import { FormContext } from '@/contexts/context'
import { Simuleringsresultat } from '@/common'
import { Table } from '@navikt/ds-react'

interface BeregnProps {
  alderspensjon: Simuleringsresultat['alderspensjon']
  afpPrivat: Simuleringsresultat['afpPrivat']
}

const ResultTable: React.FC<BeregnProps> = ({ alderspensjon, afpPrivat }) => {
  const { state } = useContext(FormContext)

  const { alderspensjonHel, alderspensjonGradert } = useMemo(() => {
    const alderspensjonHel =
      alderspensjon.find(
        (item) => item.alder === state.heltUttak.uttaksalder?.aar
      )?.beloep || 0
    const alderspensjonGradert =
      alderspensjon.find(
        (item) => item.alder === state.gradertUttak?.uttaksalder?.aar
      )?.beloep || 0
    return { alderspensjonHel, alderspensjonGradert }
  }, [alderspensjon])

  const { afpPrivatHel, afpPrivatGradert } = useMemo(() => {
    const afpPrivatHel =
      afpPrivat?.find((item) => item.alder === state.heltUttak.uttaksalder?.aar)
        ?.beloep || 0
    const afpPrivatGradert =
      afpPrivat?.find(
        (item) => item.alder === state.gradertUttak?.uttaksalder?.aar
      )?.beloep || 0
    return { afpPrivatHel, afpPrivatGradert }
  }, [afpPrivat])

  const aarligbelopVsaGradertuttak =
    state.gradertUttak?.aarligInntektVsaPensjonBeloep || 0
  const aarligbelopVsaHeltuttak =
    state.heltUttak?.aarligInntektVsaPensjon?.beloep || 0

  return (
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
        {aarligbelopVsaGradertuttak !== 0 && (
          <Table.Row key={state.gradertUttak?.uttaksalder?.aar}>
            <Table.HeaderCell scope="row">
              Ved {state.gradertUttak?.uttaksalder?.aar}
              {' ('}
              {state.gradertUttak?.grad}
              {' %)'}
            </Table.HeaderCell>
            <Table.DataCell>{alderspensjonGradert}</Table.DataCell>
            <Table.DataCell>{afpPrivatGradert}</Table.DataCell>
            <Table.DataCell>
              {state.gradertUttak?.aarligInntektVsaPensjonBeloep}
            </Table.DataCell>
            <Table.DataCell>
              {alderspensjonGradert +
                afpPrivatGradert +
                +aarligbelopVsaGradertuttak}
            </Table.DataCell>
          </Table.Row>
        )}
        <Table.Row key={state.heltUttak.uttaksalder?.aar}>
          <Table.HeaderCell scope="row">
            Ved {state.heltUttak.uttaksalder?.aar} {'(100 %)'}
          </Table.HeaderCell>
          <Table.DataCell>{alderspensjonHel}</Table.DataCell>
          <Table.DataCell>{afpPrivatHel}</Table.DataCell>
          <Table.DataCell>{aarligbelopVsaHeltuttak}</Table.DataCell>
          <Table.DataCell>
            {alderspensjonHel + afpPrivatHel + +aarligbelopVsaHeltuttak}
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default ResultTable
