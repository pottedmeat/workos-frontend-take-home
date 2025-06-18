import { Table } from '@radix-ui/themes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renameRole } from '../api/mutations';
import { listRolesOptions, searchRolesOptions } from '../api/options';
import placeholder from '../api/placeholder';
import { useDirectory } from '../hooks/useDirectory';
import { EmptyRow } from './rows/EmptyRow';
import { PaginationRow } from './rows/PaginationRow';
import { RoleRow } from './rows/RoleRow';

interface RoleDirectoryTableProps {
  search?: string;
}

export function RoleDirectoryTable({ search }: RoleDirectoryTableProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const queryClient = useQueryClient();

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setPageNumber(1);
  }, [search]);

  // Fetch the roles directory data for the current page
  const directory = useQuery(search ? searchRolesOptions(search, pageNumber) : listRolesOptions(pageNumber));

  // Handle role rename and automatically refetch on completion
  const renameRoleMutation = useMutation({
    mutationFn: (variables: { id: string; name: string }) => renameRole(variables.id, variables.name),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listRolesOptions().queryKey });
    },
  });

  // Locally update a role's name while the rename mutation is pending
  const rolesPage = useMemo(() => {
    if (!directory.data) return undefined;

    return directory.data.data.map((role) => {
      if (role.id === renameRoleMutation.variables?.id) {
        return { ...role, name: renameRoleMutation.variables.name };
      }
      return role;
    });
  }, [directory.data?.data, renameRoleMutation.variables]);

  // Pagination handlers
  const handleNext = useCallback(() => setPageNumber((page) => page + 1), []);
  const handlePrevious = useCallback(() => setPageNumber((page) => page - 1), []);

  const isPreviousDisabled = pageNumber === 1;
  const isNextDisabled = directory.data?.next === null || directory.isPending;

  const handleRenameRole = useCallback(
    (roleId: string, newName: string) => renameRoleMutation.mutate({ id: roleId, name: newName }),
    [renameRoleMutation],
  );

  return (
    <Table.Root variant="surface" layout="fixed">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell width="25%">Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="50%">Description</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="21%">Created</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="4%" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {directory.isPending ? (
          <>
            <RoleRow key="skeleton" role={placeholder.role} skeleton />
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <EmptyRow key={i} columns={4} />
              ))}
          </>
        ) : (
          <>
            {rolesPage?.map((role) => (
              <RoleRow key={role.id} role={role} onRename={handleRenameRole} />
            ))}
            {Array(10 - (rolesPage?.length ?? 0))
              .fill(null)
              .map((_, i) => (
                <EmptyRow key={i} columns={4} />
              ))}
          </>
        )}
        <PaginationRow
          columns={4}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isNextDisabled={isNextDisabled}
          isPreviousDisabled={isPreviousDisabled}
        />
      </Table.Body>
    </Table.Root>
  );
} 