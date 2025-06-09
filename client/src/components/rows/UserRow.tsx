import { Avatar, Flex, Skeleton, Table } from "@radix-ui/themes";
import React from "react";
import { formatDate } from "../../utils/date";

import type { UserWithRole } from "../../types";

export interface UserRowProps {
    user: UserWithRole;
    skeleton?: boolean;
}

export function UserRow({ user, skeleton }: UserRowProps) {
    const MaybeSkeleton = skeleton ? Skeleton : React.Fragment;
    return (
        <Table.Row>
            <Table.Cell><Flex gap="2"><MaybeSkeleton><Avatar src={user.photo} fallback="A" radius="full" size="1" /></MaybeSkeleton> <MaybeSkeleton><span>{user.first} {user.last}</span></MaybeSkeleton></Flex></Table.Cell>
            <Table.Cell><MaybeSkeleton>{user.role.name}</MaybeSkeleton></Table.Cell>
            <Table.Cell><MaybeSkeleton>{formatDate(user.createdAt)}</MaybeSkeleton></Table.Cell>
        </Table.Row>
    );
}