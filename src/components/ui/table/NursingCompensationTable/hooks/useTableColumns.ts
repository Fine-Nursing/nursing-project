import { useMemo } from 'react';
import type { Column } from 'react-table';
import type { NursingPosition } from 'src/types/nursing';
import type { ColumnId } from '../CustomizePanel';
import {
  UserCell,
  ShiftCell,
  CombinedPayCell,
  ExperienceCell,
} from '../components/TableCells';

export function useTableColumns(activeColumns: ColumnId[]) {
  const allColumns = useMemo<Column<NursingPosition>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: UserCell,
      },
      {
        Header: 'Specialty',
        accessor: 'specialty',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Exp.',
        accessor: 'experience',
        Cell: ExperienceCell,
      },
      {
        Header: 'Shift',
        accessor: 'shift',
        Cell: ShiftCell,
      },
      {
        Header: 'Pay/Hr',
        accessor: (row) => row.compensation?.hourly || 0,
        Cell: CombinedPayCell,
        id: 'compensation',
      },
    ],
    []
  );

  const columns = useMemo<Column<NursingPosition>[]>(
    () =>
      activeColumns
        .map((colId) => {
          if (colId === 'shiftType') {
            return allColumns.find(
              (col) => col.id === 'shift' || col.accessor === 'shift'
            );
          }
          return allColumns.find(
            (col) => col.id === colId || col.accessor === colId
          );
        })
        .filter(Boolean) as Column<NursingPosition>[],
    [allColumns, activeColumns]
  );

  return { allColumns, columns };
}