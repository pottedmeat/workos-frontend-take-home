import { Table } from '@radix-ui/themes';
import { useDirectory } from '../hooks/useDirectory';
import { UserRow } from './rows/UserRow';
import placeholder from '../api/placeholder';
import { EmptyRow } from './rows/EmptyRow';

interface DirectoryTableProps {
  userOrRole: 'user' | 'role';
  pageNumber?: number;
  search?: string;
}

export function DirectoryTable({ userOrRole, pageNumber = 1, search }: DirectoryTableProps) {
  const directory = useDirectory(userOrRole, { pageNumber, search });

  // Radix UI table implementation will go here

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {directory.isPending ? (
          <>
            <UserRow key="skeleton" user={placeholder} skeleton />
            {Array(9).fill(null).map((_, i) => <EmptyRow key={i} columns={3} />)}
          </>
        ) : directory.userOrRole === 'user' ? (
          <>
            {directory.page?.data.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {Array(10 - (directory.page?.data?.length ?? 0)).fill(null).map((_, i) => <EmptyRow key={i} columns={3} />)}
          </>
        ) : undefined}
      </Table.Body>
    </Table.Root>
  );
}