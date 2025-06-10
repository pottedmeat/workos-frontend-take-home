import { Table } from '@radix-ui/themes';
import { useDirectory } from '../hooks/useDirectory';
import { UserRow } from './rows/UserRow';
import placeholder from '../api/placeholder';
import { EmptyRow } from './rows/EmptyRow';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, renameRole } from '../api/mutations';
import { listUsersOptions, listRolesOptions } from '../api/options';
import { RoleRow } from './rows/RoleRow';
import { PaginationRow } from './rows/PaginationRow';

interface DirectoryTableProps {
  userOrRole: 'user' | 'role';
  search?: string;
}

export function DirectoryTable({ userOrRole, search }: DirectoryTableProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPageNumber(1);
  }, [search]);

  const directory = useDirectory(userOrRole, { pageNumber, search });
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listUsersOptions().queryKey });
    }
  });

  const renameRoleMutation = useMutation({
    mutationFn: (variables: { id: string, name: string }) => renameRole(variables.id, variables.name),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listRolesOptions().queryKey });
    }
  });

  const usersPage = directory.userOrRole === 'user' ? directory.page?.data?.filter((user) => deleteUserMutation.error || user.id !== deleteUserMutation.variables) : undefined;
  const rolesPage = useMemo(() => {
    if (directory.userOrRole !== 'role' || !directory.page?.data) {
      return undefined;
    }
    return directory.page.data.map((role) => {
      if (role.id === renameRoleMutation.variables?.id) {
        return {
          ...role,
          name: renameRoleMutation.variables.name
        };
      }
      return role;
    });
  }, [directory.userOrRole, directory.page?.data, renameRoleMutation.variables]);
  
  // TODO: Deal with stacked deletes while deleteUserMutation.isPending
  // TODO: Error handling can be shown when deleteUserMutation.error is not undefined

  const handleDeleteUser = useCallback((userId: string) => {
    deleteUserMutation.mutate(userId);
  }, [deleteUserMutation]);

  const handleRenameRole = useCallback((roleId: string, newName: string) => {
    renameRoleMutation.mutate({ id: roleId, name: newName });
  }, [renameRoleMutation]);

  const handleNext = useCallback(() => {
    setPageNumber((page) => page + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setPageNumber((page) => page - 1);
  }, []);

  const isPreviousDisabled = pageNumber === 1;
  const isNextDisabled = directory.page?.next === null || directory.isPending;

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
              {directory.userOrRole === 'user' && <UserRow key="skeleton" user={placeholder} skeleton />}
              {directory.userOrRole === 'role' && <RoleRow key="skeleton" role={placeholder.role} skeleton />}
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
                <RoleRow key={role.id} role={role} onRename={handleRenameRole} />
              ))}
              {Array(10 - (rolesPage?.length ?? 0)).fill(null).map((_, i) => <EmptyRow key={i} columns={4} />)}
            </>
          ) : undefined}
          <PaginationRow
            columns={4}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isNextDisabled={isNextDisabled}
            isPreviousDisabled={isPreviousDisabled}
          />
        </Table.Body>
      </Table.Root>
    </>
  );
}