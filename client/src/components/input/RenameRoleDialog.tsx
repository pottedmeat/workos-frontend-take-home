import { Button, Dialog, Flex, Strong, TextField } from "@radix-ui/themes";
import React from "react";

interface RenameRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRename: () => void;
    roleName: string;
    newRoleName: string;
    onNewRoleNameChange: (newName: string) => void;
}

export function RenameRoleDialog({
    open,
    onOpenChange,
    onRename,
    roleName,
    newRoleName,
    onNewRoleNameChange
}: RenameRoleDialogProps) {
    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onRename();
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content maxWidth="488px">
                <Dialog.Title>Rename role</Dialog.Title>
                <Dialog.Description size="2">
                    Enter a new name for the role <Strong>{roleName}</Strong>.
                </Dialog.Description>

                <form onSubmit={handleOnSubmit}>
                    <TextField.Root
                        value={newRoleName}
                        onChange={(e) => onNewRoleNameChange(e.target.value)}
                        mt="4"
                        aria-label="New role name"
                    />

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="surface" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button variant="surface" type="submit">
                                Rename
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}