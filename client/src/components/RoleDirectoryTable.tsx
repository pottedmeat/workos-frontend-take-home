import { Table } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { listRolesOptions, searchRolesOptions } from '../api/options';
import placeholder from '../api/placeholder';
import { EmptyRow } from './rows/EmptyRow';
import { PaginationRow } from './rows/PaginationRow';
import { RoleRow } from './rows/RoleRow';

interface RoleDirectoryTableProps {
  search?: string;
}

export function RoleDirectoryTable({ search }: RoleDirectoryTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setPageNumber(1);
  }, [search]);

  // Fetch the roles directory data for the current page
  const directory = useQuery(search ? searchRolesOptions(search, pageNumber) : listRolesOptions(pageNumber));

  const rolesPage = directory.data?.data?.map((role) => ({ ...role, page: pageNumber }));

  // Pagination handlers
  const handleNext = useCallback(() => setPageNumber((page) => page + 1), []);
  const handlePrevious = useCallback(() => setPageNumber((page) => page - 1), []);

  const isPreviousDisabled = pageNumber === 1;
  const isNextDisabled = directory.data?.next === null || directory.isPending;

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
            <RoleRow key="skeleton" role={{ ...placeholder.role, page: pageNumber }} skeleton />
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <EmptyRow key={i} columns={4} />
              ))}
          </>
        ) : (
          <>
            {rolesPage?.map((role) => (
              <RoleRow key={role.id} role={role} />
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