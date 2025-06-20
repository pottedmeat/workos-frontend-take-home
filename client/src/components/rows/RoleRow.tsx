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
}

export function RoleRow({ role, skeleton }: RoleRowProps) {
    const [showRenameDialog, setShowRenameDialog] = useState(false);

    const handleRename = useCallback(() => {
        setShowRenameDialog(true);
    }, [setShowRenameDialog]);

    const MaybeSkeleton = skeleton ? Skeleton : React.Fragment;
    return (
        <Table.Row>
            <StyledCell><MaybeSkeleton>{role.name}</MaybeSkeleton></StyledCell>
            <StyledCell style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={role.description}><MaybeSkeleton>{role.description}</MaybeSkeleton></StyledCell>
                    <StyledCell><MaybeSkeleton>{formatDate(role.createdAt)}</MaybeSkeleton></StyledCell>
            <StyledCell><Flex justify="end">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger disabled={skeleton}>
                        <IconButton variant="ghost" radius="full" color="gray" size="1" disabled={skeleton} aria-label={`Options for ${role.name} role`}><DotsHorizontalIcon width="16" height="16" /></IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onSelect={handleRename}>Rename role</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <RenameRoleDialog
                    open={showRenameDialog}
                    onOpenChange={setShowRenameDialog}
                    role={role}
                />
            </Flex></StyledCell>
        </Table.Row>
    );
}
