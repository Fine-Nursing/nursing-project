'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Row, Column as ReactTableColumn } from 'react-table';

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

type Column = ReactTableColumn<Data> & {
  isSorted?: boolean;
  isSortedDesc?: boolean;
  getSortByToggleProps?: () => any;
  getHeaderProps: (props: any) => any;
  canSort?: boolean;
  render: (type: string) => React.ReactNode;
  Header: string;
  accessor: keyof Data;
};

type HeaderGroup = {
  headers: Column[];
  getHeaderGroupProps: () => { key: string; [key: string]: any };
};

type Props = {
  headerGroups: HeaderGroup[];
  page: Row<Data>[];
  prepareRow: (row: Row<Data>) => void;
  getTableProps: () => any;
  getTableBodyProps: () => any;
};

export default function TableView({
  headerGroups,
  page,
  prepareRow,
  getTableProps,
  getTableBodyProps,
}: Props) {
  const renderSortIcon = (column: Column) => {
    if (!column.isSorted) return <ArrowUpDown className="w-4 h-4" />;
    return column.isSortedDesc ? (
      <ArrowDown className="w-4 h-4" />
    ) : (
      <ArrowUp className="w-4 h-4" />
    );
  };

  return (
    <table {...getTableProps()} className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        {headerGroups.map((headerGroup) => {
          const { key: groupKey, ...headerGroupProps } =
            headerGroup.getHeaderGroupProps();
          return (
            <tr key={groupKey} {...headerGroupProps}>
              {headerGroup.headers.map((column) => {
                const sortProps = column.getSortByToggleProps?.() || {};
                const { key: columnKey, ...columnProps } =
                  column.getHeaderProps(sortProps);
                return (
                  <th
                    key={columnKey}
                    {...columnProps}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
        className="bg-white divide-y divide-gray-200"
      >
        {page.map((row) => {
          prepareRow(row);
          const { key: rowKey, ...rowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...rowProps} className="hover:bg-gray-50">
              {row.cells.map((cell) => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();
                return (
                  <td
                    key={cellKey}
                    {...cellProps}
                    className="px-6 py-4 whitespace-nowrap"
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
  );
}
