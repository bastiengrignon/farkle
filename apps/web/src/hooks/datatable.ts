import { useEffect, useMemo, useRef, useState } from 'react';

import type { DataTableSortStatus } from 'mantine-datatable';

export const sortDirections = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortDirection = (typeof sortDirections)[keyof typeof sortDirections];

interface UseSortTableProps<T> {
  records: T[];
  columnAccessor: keyof T;
  direction: SortDirection;
  sortingFunction?: Partial<Record<keyof T, (status: DataTableSortStatus<T>) => (a: T, b: T) => number>>;
}

// biome-ignore lint/suspicious/noExplicitAny: unknown record object
export const useSortTable = <T extends Record<string, any>>({
  records,
  columnAccessor,
  direction,
  sortingFunction = {},
}: UseSortTableProps<T>) => {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor,
    direction: sortDirections[direction as keyof typeof sortDirections] ?? direction,
  });

  const sortingFunctionRef = useRef<((status: DataTableSortStatus<T>) => (a: T, b: T) => number) | undefined>(
    undefined
  );
  sortingFunctionRef.current = sortingFunction[sortStatus.columnAccessor];

  const sortedRecords = useMemo(() => {
    const sortedData = [...records];
    if (sortingFunctionRef.current) {
      sortedData.sort(sortingFunctionRef.current(sortStatus));
    } else {
      sortedData.sort((recordA, recordB) => recordA[sortStatus.columnAccessor] - recordB[sortStatus.columnAccessor]);
    }

    return sortStatus.direction === sortDirections.asc ? sortedData : sortedData.reverse();
  }, [records, sortStatus]);

  useEffect(() => {
    sortingFunctionRef.current = sortingFunction[sortStatus.columnAccessor];
  }, [sortStatus.columnAccessor, sortingFunction]);

  return {
    sortStatus,
    setSortStatus,
    sortedRecords,
  };
};
