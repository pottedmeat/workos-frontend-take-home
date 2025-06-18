import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, AlertDialog, Flex, Spinner, Strong, Text, TextField } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { renameRole } from "../../api/mutations";
import { listRolesOptions } from "../../api/options";
import type { Role } from "../../types";

interface RenameRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role;
}

export function RenameRoleDialog({ open, onOpenChange, role }: RenameRoleDialogProps) {
    const queryClient = useQueryClient();

    const [newRoleName, setNewRoleName] = useState(role.name);

    // Reset the input when the dialog is opened again
    useEffect(() => {
        if (open) {
            setNewRoleName(role.name);
        }
    }, [open, role.name]);

    // Handle role rename and automatically refetch on completion
    const renameRoleMutation = useMutation({
        mutationFn: (name: string) => renameRole(role.id, name),
        onSuccess: async () => {
            return queryClient.refetchQueries({ queryKey: listRolesOptions(role.page ?? 1).queryKey });
        },
    });

    const handleConfirmRename = useCallback((e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            renameRoleMutation.mutateAsync(newRoleName).then(() => {
                onOpenChange(false);
            });
        }, [renameRoleMutation, newRoleName, onOpenChange]);

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content maxWidth="488px">
                <AlertDialog.Title>Rename role</AlertDialog.Title>
                {renameRoleMutation.error && (
                        <Flex
                            role="alert"
                            align="center"
                            gap="2"
                            p="2"
                            mb="3"
                            style={{
                                borderLeft: "4px solid var(--red-9)",
                                backgroundColor: "var(--red-3)",
                            }}
                        >
                            <ExclamationTriangleIcon color="var(--red-9)" />
                            <Text color="red">
                                {(renameRoleMutation.error as Error)?.message ?? "An unexpected error occurred."}
                            </Text>
                        </Flex>
                    )}
                <AlertDialog.Description size="2">
                    Enter a new name for the role <Strong>{role.name}</Strong>.
                </AlertDialog.Description>

                <form onSubmit={handleConfirmRename}>
                    <TextField.Root
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        mt="4"
                        aria-label="New role name"
                        disabled={renameRoleMutation.isPending}
                    />

                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="surface" color="gray" disabled={renameRoleMutation.isPending}>
                                <Strong>Cancel</Strong>
                            </Button>
                        </AlertDialog.Cancel>
                        <Button variant="surface" type="submit" disabled={renameRoleMutation.isPending}>
                            <Strong>{renameRoleMutation.isPending ? (
                                <Flex direction="row" gap="2" align="center">
                                    <Spinner size="1" /> Renaming...
                                </Flex>
                            ) : (
                                'Rename role'
                            )}</Strong>
                        </Button>
                    </Flex>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}