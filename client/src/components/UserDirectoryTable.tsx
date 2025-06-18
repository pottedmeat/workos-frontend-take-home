import { Table } from '@radix-ui/themes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { deleteUser } from '../api/mutations';
import { listUsersOptions } from '../api/options';
import placeholder from '../api/placeholder';
import { useDirectory } from '../hooks/useDirectory';
import { EmptyRow } from './rows/EmptyRow';
import { PaginationRow } from './rows/PaginationRow';
import { UserRow } from './rows/UserRow';

interface UserDirectoryTableProps {
  search?: string;
}

export function UserDirectoryTable({ search }: UserDirectoryTableProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const queryClient = useQueryClient();

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setPageNumber(1);
  }, [search]);

  // Fetch the users directory data for the current page
  const directory = useDirectory({ pageNumber, search });

  // Handle user deletion and automatically refetch on completion
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listUsersOptions().queryKey });
    },
  });

  // Exclude a user from the local page list while a delete is pending for that user
  const usersPage = directory.page?.data?.filter(
    (user) => deleteUserMutation.error || user.id !== deleteUserMutation.variables,
  );

  // Pagination handlers
  const handleNext = useCallback(() => setPageNumber((page) => page + 1), []);
  const handlePrevious = useCallback(() => setPageNumber((page) => page - 1), []);

  const isPreviousDisabled = pageNumber === 1;
  const isNextDisabled = directory.page?.next === null || directory.isPending;

  return (
    <Table.Root variant="surface" layout="fixed">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell width="35%">User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="33%">Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="28%">Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="4%" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {directory.isPending ? (
          <>
            <UserRow key="skeleton" user={placeholder} skeleton />
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <EmptyRow key={i} columns={4} />
              ))}
          </>
        ) : (
          <>
            {usersPage?.map((user) => (
              <UserRow key={user.id} user={user} onDelete={deleteUserMutation.mutate} />
            ))}
            {Array(10 - (usersPage?.length ?? 0))
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