import { Table } from '@radix-ui/themes';
import { Toast } from 'radix-ui';
import { useDirectory } from '../hooks/useDirectory';
import { UserRow } from './rows/UserRow';
import placeholder from '../api/placeholder';
import { EmptyRow } from './rows/EmptyRow';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api/mutations';
import { listUsersOptions } from '../api/options';

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
  
  // TODO: Deal with stacked deletes while deleteUserMutation.isPending
  // TODO: Error handling can be shown when deleteUserMutation.error is not undefined

  const handleDeleteUser = useCallback((userId: string) => {
    deleteUserMutation.mutate(userId);
  }, []);

  console.log(deleteUserMutation);

  return (
    <>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
          ) : undefined}
        </Table.Body>
      </Table.Root>
    </>
  );
}