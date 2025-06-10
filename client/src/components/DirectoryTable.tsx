import { Table } from '@radix-ui/themes';
import { useDirectory } from '../hooks/useDirectory';
import { UserRow } from './rows/UserRow';
import placeholder from '../api/placeholder';
import { EmptyRow } from './rows/EmptyRow';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api/mutations';
import { listUsersOptions } from '../api/options';
import { RoleRow } from './rows/RoleRow';

interface DirectoryTableProps {
  userOrRole: 'user' | 'role';
  pageNumber?: number;
  search?: string;
}

export function DirectoryTable({ userOrRole, pageNumber = 1, search }: DirectoryTableProps) {
  const queryClient = useQueryClient();
  const directory = useDirectory(userOrRole, { pageNumber, search });
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listUsersOptions().queryKey });
    }
  });
  const usersPage = directory.userOrRole === 'user' ? directory.page?.data?.filter((user) => deleteUserMutation.error || user.id !== deleteUserMutation.variables) : undefined;
  const rolesPage = directory.userOrRole === 'role' ? directory.page?.data : undefined;
  
  // TODO: Deal with stacked deletes while deleteUserMutation.isPending
  // TODO: Error handling can be shown when deleteUserMutation.error is not undefined

  const handleDeleteUser = useCallback((userId: string) => {
    deleteUserMutation.mutate(userId);
  }, []);

  console.log(deleteUserMutation);

  return (
    <>
      <Table.Root variant="surface" layout="fixed">
        <Table.Header>
          <Table.Row>
            {userOrRole === 'user' ? (
              <>
                <Table.ColumnHeaderCell width="35%">User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="33%">Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="28%">Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="4%"></Table.ColumnHeaderCell>
              </>
            ) : (
              <>
                <Table.ColumnHeaderCell width="25%">Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="50%">Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="21%">Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="4%"></Table.ColumnHeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {directory.isPending ? (
            <>
              <UserRow key="skeleton" user={placeholder} skeleton />
              {Array(9).fill(null).map((_, i) => <EmptyRow key={i} columns={4} />)}
            </>
          ) : directory.userOrRole === 'user' ? (
            <>
              {usersPage?.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
              ))}
              {Array(10 - (usersPage?.length ?? 0)).fill(null).map((_, i) => <EmptyRow key={i} columns={4} />)}
            </>
          ) : directory.userOrRole === 'role' ? (
            <>
              {rolesPage?.map((role) => (
                <RoleRow key={role.id} role={role} />
              ))}
              {Array(10 - (rolesPage?.length ?? 0)).fill(null).map((_, i) => <EmptyRow key={i} columns={4} />)}
            </>
          ) : undefined}
        </Table.Body>
      </Table.Root>
    </>
  );
}