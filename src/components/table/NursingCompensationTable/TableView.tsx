'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type {
  ColumnInstance,
  HeaderGroup,
  Row,
  UseSortByColumnProps,
} from 'react-table';
import type { NursingPosition } from 'src/types/nursing';

interface TableViewProps {
  headerGroups: HeaderGroup<NursingPosition>[];
  page: Row<NursingPosition>[];
  prepareRow: (row: Row<NursingPosition>) => void;
  getTableProps: () => any;
  getTableBodyProps: () => any;
}

export default function TableView({
  headerGroups,
  page,
  prepareRow,
  getTableProps,
  getTableBodyProps,
}: TableViewProps) {
  const renderSortIcon = (column: any) => {
    if (!column.isSorted) return <ArrowUpDown className="w-4 h-4" />;
    return column.isSortedDesc ? (
      <ArrowDown className="w-4 h-4" />
    ) : (
      <ArrowUp className="w-4 h-4" />
    );
  };

  return (
    <div className="max-h-[650px] overflow-y-auto">
      <table {...getTableProps()} className="w-full divide-y divide-gray-300 dark:divide-zinc-700">
      <thead className="bg-gray-50 dark:bg-zinc-900 sticky top-0 z-10">
        {headerGroups.map((headerGroup) => {
          const { key: groupKey, ...restGroupProps } =
            headerGroup.getHeaderGroupProps();
          return (
            <tr key={groupKey} {...restGroupProps}>
              {headerGroup.headers.map((col) => {
                // col을 ColumnInstance<NursingPosition> & UseSortByColumnProps<NursingPosition>로 캐스팅
                const column =
                  col as unknown as ColumnInstance<NursingPosition> &
                    UseSortByColumnProps<NursingPosition>;

                const sortProps = column.getSortByToggleProps?.() || {};
                const { key: columnKey, ...restColumnProps } =
                  column.getHeaderProps(sortProps);

                return (
                  <th
                    key={columnKey}
                    {...restColumnProps}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.render('Header')}</span>
                      {column.canSort && renderSortIcon(column)}
                    </div>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className="bg-white dark:bg-zinc-950 divide-y divide-gray-200 dark:divide-zinc-700"
      >
        {page.map((row) => {
          prepareRow(row);
          const { key: rowKey, ...restRowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...restRowProps} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
              {row.cells.map((cell) => {
                const { key: cellKey, ...restCellProps } = cell.getCellProps();
                return (
                  <td
                    key={cellKey}
                    {...restCellProps}
                    className="px-4 py-3 text-sm whitespace-nowrap dark:text-zinc-200"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
