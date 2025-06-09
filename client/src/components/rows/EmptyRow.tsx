import { Table } from "@radix-ui/themes";

export interface EmptyRowProps {
    columns: number;
}

export function EmptyRow({ columns }: EmptyRowProps) {
    return (
        <Table.Row>
            {Array(columns).fill(null).map((_, i) => <Table.Cell key={i} />)}
        </Table.Row>
    );
}