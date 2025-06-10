import { Button, Flex, Strong, Table } from '@radix-ui/themes';

export interface PaginationRowProps {
  columns: number;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationRow({ columns, onNext, onPrevious, isNextDisabled, isPreviousDisabled }: PaginationRowProps) {
  return (
    <Table.Row>
      <Table.Cell colSpan={columns}>
        <Flex justify="end" gap="2">
          <Button onClick={onPrevious} disabled={isPreviousDisabled} variant="surface" color="gray" size="1">
            <Strong>Previous</Strong>
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} variant="surface" color="gray" size="1">
            <Strong>Next</Strong>
          </Button>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
} 