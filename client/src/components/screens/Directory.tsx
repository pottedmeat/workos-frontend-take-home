import { Tabs, TextField } from '@radix-ui/themes';
import { UserDirectoryTable } from '../UserDirectoryTable';
import { RoleDirectoryTable } from '../RoleDirectoryTable';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useState } from 'react';

export function Directory() {
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('users');

    const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value) {
            setInput(value);
        } else {
            setInput('');
            setSearch('');
        }
    }, [search, setInput, setSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
          setSearch(input);
        }, 300);

        return () => {
          clearTimeout(handler);
        };
      }, [input, setSearch]);

    return (
        <Tabs.Root defaultValue="users" mx="15px" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} onValueChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Trigger value="users">Users</Tabs.Trigger>
                <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
            </Tabs.List>
            <TextField.Root placeholder="Search by name..." onChange={handleInput} aria-label={`Search ${activeTab} by name`}>
                <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
            </TextField.Root>
            <Tabs.Content value="users">
                <div hidden={!search}>
                    <UserDirectoryTable search={search} />
                </div>
                <div hidden={!!search}>
                    <UserDirectoryTable />
                </div>
            </Tabs.Content>
            <Tabs.Content value="roles">
                <div hidden={!search}>
                    <RoleDirectoryTable search={search} />
                </div>
                <div hidden={!!search}>
                    <RoleDirectoryTable />
                </div>
            </Tabs.Content>
        </Tabs.Root>
    )
}
