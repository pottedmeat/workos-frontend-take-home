import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, IconButton, Skeleton, Table } from "@radix-ui/themes";
import React, { useCallback, useState } from "react";
import { StyledCell } from "../../styles";
import { formatDate } from "../../utils/date";

import type { Role } from "../../types";
import { RenameRoleDialog } from "../input/RenameRoleDialog";

export interface RoleRowProps {
    role: Role;
    skeleton?: boolean;
    onRename?: (roleId: string, newName: string) => void;
}

export function RoleRow({ role, skeleton, onRename }: RoleRowProps) {
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");

    const handleRename = useCallback(() => {
        setNewRoleName(role.name);
        setShowRenameDialog(true);
    }, [role.name]);

    const handleConfirmRename = useCallback(() => {
        onRename?.(role.id, newRoleName);
    }, [onRename, role.id, newRoleName]);

    const MaybeSkeleton = skeleton ? Skeleton : React.Fragment;
    return (
        <Table.Row>
            <StyledCell><MaybeSkeleton>{role.name}</MaybeSkeleton></StyledCell>
            <StyledCell style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={role.description}><MaybeSkeleton>{role.description}</MaybeSkeleton></StyledCell>
            <StyledCell><MaybeSkeleton>{formatDate(role.createdAt)}</MaybeSkeleton></StyledCell>
            <StyledCell><Flex justify="end">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger disabled={skeleton}>
                        <IconButton variant="ghost" radius="full" color="gray" size="1" disabled={skeleton}><DotsHorizontalIcon width="16" height="16" /></IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onSelect={handleRename}>Rename role</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <RenameRoleDialog
                    open={showRenameDialog}
                    onOpenChange={setShowRenameDialog}
                    onRename={handleConfirmRename}
                    roleName={role.name}
                    newRoleName={newRoleName}
                    onNewRoleNameChange={setNewRoleName}
                />
            </Flex></StyledCell>
        </Table.Row>
    );
}
