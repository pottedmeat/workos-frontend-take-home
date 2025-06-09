import { Avatar, Table } from "@radix-ui/themes";
import type { UserWithRole } from "../../types";

export function UserRow({ user }: { user: UserWithRole }) {
    return (
        <Table.Row>
            <Table.Cell><Avatar src={user.photo} fallback="A" radius="full" size="1" /> {user.first} {user.last}</Table.Cell>
            <Table.Cell>{user.role.name}</Table.Cell>
            <Table.Cell>{`${user.createdAt}`}</Table.Cell>
        </Table.Row>
    );
}