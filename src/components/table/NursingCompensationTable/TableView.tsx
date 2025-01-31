'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

import type {
  ColumnInstance,
  HeaderGroup,
  Row,
  UseSortByColumnProps,
} from 'react-table';

type Data = {
  user: string;
  specialty: string;
  location: string;
  experience: number | string;
  shiftType: 'Day' | 'Night';
  basePay: number;
  differentials: number;
  totalPay: number;
};

interface TableViewProps {
  headerGroups: HeaderGroup<Data>[];
  page: Row<Data>[];
  prepareRow: (row: Row<Data>) => void;
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
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const { key: groupKey, ...restGroupProps } =
            headerGroup.getHeaderGroupProps();
          return (
            <tr key={groupKey} {...restGroupProps}>
              {headerGroup.headers.map((col) => {
                // (1) col을 ColumnInstance<Data> & UseSortByColumnProps<Data> 로 캐스팅
                const column = col as unknown as ColumnInstance<Data> &
                  UseSortByColumnProps<Data>;

                const sortProps = column.getSortByToggleProps?.() || {};
                const { key: columnKey, ...restColumnProps } =
                  column.getHeaderProps(sortProps);

                return (
                  <th key={columnKey} {...restColumnProps}>
                    <div className="flex items-center space-x-2">
                      <span>{column.render('Header')}</span>
                      {/* (2) canSort, isSorted 등도 여기서 정상 인식 */}
                      {column.canSort && renderSortIcon(column)}
                    </div>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          const { key: rowKey, ...restRowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...restRowProps}>
              {row.cells.map((cell) => {
                const { key: cellKey, ...restCellProps } = cell.getCellProps();
                return (
                  <td key={cellKey} {...restCellProps}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
