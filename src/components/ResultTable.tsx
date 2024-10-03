import { useContext } from 'react'
import { FormContext } from '@/contexts/context'
import { ContextForm, FormValueResult, PensjonData } from '@/common'
import { Table } from '@navikt/ds-react'

interface BeregnProps {
    beregnResult: FormValueResult
  }

const ResultTable: React.FC<BeregnProps> = ({ beregnResult }) => {
    const { states, setState } = useContext(FormContext) as ContextForm

    const alderspensjonHel = beregnResult?.alderspensjon?.find(item => item.alder === states.heltUttak.uttakAlder.aar)?.beloep || 0
    const alderspensjonGradert = beregnResult?.alderspensjon?.find(item => item.alder === states.gradertUttak.uttakAlder.aar)?.beloep || 0
    const afpPrivatHel = beregnResult?.afpPrivat?.find(item => item.alder === states.heltUttak.uttakAlder.aar)?.beloep || 0
    const afpPrivatGradert = beregnResult?.afpPrivat?.find(item => item.alder === states.gradertUttak.uttakAlder.aar)?.beloep || 0

    return(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">
                Alder og uttaksgrad
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">Fra folketrygden</Table.HeaderCell>
              <Table.HeaderCell scope="col">AFP privat</Table.HeaderCell>
              <Table.HeaderCell scope="col">Arbeidsinntekt</Table.HeaderCell>
              <Table.HeaderCell scope="col">Sum</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {states.gradertUttak.grad !== 100 && (
              <Table.Row key={states.gradertUttak.uttakAlder.aar}>
                <Table.HeaderCell scope="row">
                  Ved {states.gradertUttak.uttakAlder.aar}{"("} 
                  {states.gradertUttak.grad}{"%)"} 
                </Table.HeaderCell>
                <Table.DataCell>{alderspensjonGradert}</Table.DataCell>
                <Table.DataCell>{afpPrivatGradert}</Table.DataCell>
                <Table.DataCell>{states.gradertUttak.aarligInntektVsaPensjonBeloep}</Table.DataCell>
                <Table.DataCell>{alderspensjonGradert + afpPrivatGradert + states.gradertUttak.aarligInntektVsaPensjonBeloep}</Table.DataCell>
              </Table.Row>
            )}
            <Table.Row key={states.heltUttak.uttakAlder.aar}>
              <Table.HeaderCell scope="row">
                Ved {states.heltUttak.uttakAlder.aar} {"(100%)"}
              </Table.HeaderCell>
              <Table.DataCell>{alderspensjonHel}</Table.DataCell>
              <Table.DataCell>{afpPrivatHel}</Table.DataCell>
              <Table.DataCell>{states.heltUttak.aarligInntektVsaPensjon.beloep ? states.heltUttak.aarligInntektVsaPensjon.beloep : 0}</Table.DataCell>
              <Table.DataCell>{alderspensjonHel + afpPrivatHel + states.heltUttak.aarligInntektVsaPensjon.beloep}</Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
    );
}

export default ResultTable;