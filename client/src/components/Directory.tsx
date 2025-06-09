import { Tabs } from '@radix-ui/themes';
import { useDirectory } from '../hooks/useDirectory';
import { useState } from 'react';

export const Directory = () => {
    const [page] = useState(1);
    const usersPage = useDirectory('user', page);
    console.log({ usersPage });

    return (
        <Tabs.Root defaultValue="users" mx="15px" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Tabs.List>
                <Tabs.Trigger value="users">Users</Tabs.Trigger>
                <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="users">
                <p>Users</p>
            </Tabs.Content>
            <Tabs.Content value="roles">
                <p>Roles</p>
            </Tabs.Content>
        </Tabs.Root>
    )
}
