import { Table } from "@navikt/ds-react";

const ResultTable = () => {

    return(
        <Table>
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
                {/* Fyll inn data her (slik som i gamle pensjonskalk.) */}
            </Table.Body>
        </Table>
    );
};

export default ResultTable;