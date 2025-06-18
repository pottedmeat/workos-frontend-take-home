import { AlertDialog, Button, Flex, Spinner, Strong, Text } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { deleteUser } from "../../api/mutations";
import type { Paged, UserWithRole } from "../../types";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserWithRole;
}

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
    const queryClient = useQueryClient();

    // Handle user deletion and automatically refetch on completion
    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: async () => {
            return queryClient.refetchQueries({
                type: 'all',
                predicate: ({ queryKey }) => {
                    const [userOrRole, { page = 1 }] = queryKey as [string, Paged];
                    return userOrRole === 'users' && page >= user.page;
                }
            });
        },
    });

    const handleConfirmDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteUserMutation.mutateAsync(user.id).then(() => {
            onOpenChange(false);
        });
    }, [deleteUserMutation, user.id]);

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content maxWidth="488px">
                <AlertDialog.Title>Delete user</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {deleteUserMutation.error && (
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
                                {(deleteUserMutation.error as Error)?.message ?? "An unexpected error occurred."}
                            </Text>
                        </Flex>
                    )}
                    Are you sure? The user <Strong>{user.first} {user.last}</Strong> will be permanently deleted.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="surface" color="gray" disabled={deleteUserMutation.isPending}>
                            <Strong>Cancel</Strong>
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="surface" color="red" disabled={deleteUserMutation.isPending} onClick={handleConfirmDelete}>
                            <Strong>{deleteUserMutation.isPending ? (<Flex direction="row" gap="2" align="center"><Spinner size="1" /> Deleting...</Flex>) : 'Delete user'}</Strong>
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
} 