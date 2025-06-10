import { AlertDialog, Button, Flex, Strong } from "@radix-ui/themes";

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    userName: string;
}

export function DeleteUserDialog({ open, onOpenChange, onConfirm, userName }: DeleteUserDialogProps) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content maxWidth="488px">
                <AlertDialog.Title>Revoke access</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure? The user <Strong>{userName}</Strong> will be permanently deleted.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="surface" color="gray">
                            <Strong>Cancel</Strong>
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="surface" color="red" onClick={onConfirm}>
                            <Strong>Delete user</Strong>
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
} 