import { Table } from "@radix-ui/themes";

export interface EmptyRowProps {
    columns: number;
}

export function EmptyRow({ columns }: EmptyRowProps) {
    return (
        <Table.Row>
            <Table.Cell colSpan={columns} />
        </Table.Row>
    );
}