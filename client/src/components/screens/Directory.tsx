import { Tabs } from '@radix-ui/themes';
import { DirectoryTable } from '../DirectoryTable';

export interface DirectoryProps {
    search?: string;
}

export function Directory({ search }: DirectoryProps) {
    return (
        <Tabs.Root defaultValue="users" mx="15px" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Tabs.List>
                <Tabs.Trigger value="users">Users</Tabs.Trigger>
                <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="users">
                {search ? (
                    <DirectoryTable userOrRole="user" pageNumber={1} search={search} />
                ) : (
                    <DirectoryTable userOrRole="user" pageNumber={1} />
                )}
            </Tabs.Content>
            <Tabs.Content value="roles">
                {search ? (
                    <DirectoryTable userOrRole="role" pageNumber={1} search={search} />
                ) : (
                    <DirectoryTable userOrRole="role" pageNumber={1} />
                )}
            </Tabs.Content>
        </Tabs.Root>
    )
}
