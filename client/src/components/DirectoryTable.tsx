import { Table } from '@radix-ui/themes';
import { useDirectory } from '../hooks/useDirectory';
import { UserRow } from './rows/UserRow';

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
        {directory.userOrRole === 'user' ? (
          directory.page?.data.map((user) => (
            <UserRow key={user.id} user={user} />
          ))
        ) : undefined}
      <Table.Body>
      </Table.Body>
    </Table.Root>

  );
}