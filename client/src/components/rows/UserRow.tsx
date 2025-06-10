import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Avatar, DropdownMenu, Flex, IconButton, Skeleton, Table } from "@radix-ui/themes";
import React, { useCallback, useState } from "react";
import { StyledCell } from "../../styles";
import { formatDate } from "../../utils/date";

import type { UserWithRole } from "../../types";
import { DeleteUserDialog } from "../input/DeleteUserDialog";

export interface UserRowProps {
    user: UserWithRole;
    skeleton?: boolean;
    onDelete?: (userId: string) => void;
}

export function UserRow({ user, skeleton, onDelete }: UserRowProps) {
    const [showVerifyDelete, setShowVerifyDelete] = useState(false);

    const handleDelete = useCallback(() => {
        setShowVerifyDelete(true);
    }, [setShowVerifyDelete]);

    const handleConfirmDelete = useCallback(() => {
        onDelete?.(user.id);
    }, [onDelete, user.id]);

    const MaybeSkeleton = skeleton ? Skeleton : React.Fragment;
    return (
        <Table.Row>
            <StyledCell><Flex gap="2"><MaybeSkeleton><Avatar src={user.photo} fallback={`${user.first.charAt(0)}${user.last.charAt(0)}`} radius="full" size="1" /></MaybeSkeleton> <MaybeSkeleton><span>{user.first} {user.last}</span></MaybeSkeleton></Flex></StyledCell>
            <StyledCell><MaybeSkeleton>{user.role.name}</MaybeSkeleton></StyledCell>
            <StyledCell><MaybeSkeleton>{formatDate(user.createdAt)}</MaybeSkeleton></StyledCell>
            <StyledCell><Flex justify="end">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger disabled={skeleton}>
                        <IconButton variant="ghost" radius="full" color="gray" size="1" disabled={skeleton}><DotsHorizontalIcon width="16" height="16" /></IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {/* Leave edit in the dropdown for now to see keyboard navigation */}
                        <DropdownMenu.Item>Edit user</DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={handleDelete}>Delete user</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <DeleteUserDialog
                    open={showVerifyDelete}
                    onOpenChange={setShowVerifyDelete}
                    onConfirm={handleConfirmDelete}
                    userName={`${user.first} ${user.last}`}
                />
            </Flex></StyledCell>
        </Table.Row>
    );
}