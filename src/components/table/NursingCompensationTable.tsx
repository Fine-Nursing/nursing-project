'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import {
  Settings2,
  Layout,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
} from 'lucide-react';

// Reorder array helper
const arrayMove = (arr, oldIndex, newIndex) => {
  const newArr = [...arr];
  const [movedItem] = newArr.splice(oldIndex, 1);
  newArr.splice(newIndex, 0, movedItem);
  return newArr;
};

function NursingCompensationTable({
  initialData,
  pageSize: initialPageSize = 10,
}) {
  const [viewMode, setViewMode] = useState('table');
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeColumns, setActiveColumns] = useState([
    'user',
    'specialty',
    'location',
    'experience',
    'shiftType',
    'basePay',
    'differentials',
    'totalPay',
  ]);

  const data = useMemo(
    () =>
      initialData.map((nurse) => ({
        ...nurse,
        totalPay: nurse.basePay + nurse.differentials,
      })),
    [initialData]
  );

  const allColumns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        Cell: ({ value }) => <span className="font-medium">{value}</span>,
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
        Header: 'Experience',
        accessor: 'experience',
      },
      {
        Header: 'Shift',
        accessor: 'shiftType',
        Cell: ({ value }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              value === 'Day'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Base Pay',
        accessor: 'basePay',
        Cell: ({ value }) => (
          <span className="font-medium">${value.toLocaleString()}</span>
        ),
      },
      {
        Header: 'Differentials',
        accessor: 'differentials',
        Cell: ({ value }) => <span>${value.toLocaleString()}</span>,
      },
      {
        Header: 'Total Pay',
        accessor: 'totalPay',
        Cell: ({ value }) => (
          <span className="font-medium text-green-600">
            ${value.toLocaleString()}
          </span>
        ),
      },
    ],
    []
  );

  const columns = useMemo(
    () =>
      activeColumns
        .map((colId) => allColumns.find((col) => col.accessor === colId))
        .filter(Boolean),
    [allColumns, activeColumns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: initialPageSize,
        sortBy: [{ id: 'totalPay', desc: true }],
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  // Column Customization Panel
  function CustomizePanel() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Column Order & Visibility</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCustomize(false)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Apply
            </button>
            <button
              onClick={() => {
                setActiveColumns([
                  'user',
                  'specialty',
                  'location',
                  'experience',
                  'shiftType',
                  'basePay',
                  'differentials',
                  'totalPay',
                ]);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {activeColumns.map((columnId, index) => {
            const column = allColumns.find((col) => col.accessor === columnId);
            return (
              <div
                key={columnId}
                className="flex items-center justify-between bg-white p-2 rounded border"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={activeColumns.includes(columnId)}
                    onChange={(e) => {
                      setActiveColumns(
                        e.target.checked
                          ? [...activeColumns, columnId]
                          : activeColumns.filter((id) => id !== columnId)
                      );
                    }}
                    className="mr-3 rounded border-gray-300 text-purple-600"
                  />
                  <span>{column.Header}</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      if (index > 0) {
                        setActiveColumns(
                          arrayMove(activeColumns, index, index - 1)
                        );
                      }
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (index < activeColumns.length - 1) {
                        setActiveColumns(
                          arrayMove(activeColumns, index, index + 1)
                        );
                      }
                    }}
                    disabled={index === activeColumns.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular Table View
  function TableView({ headerGroups, page }) {
    return (
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup, groupIdx) => (
            <tr key={groupIdx}>
              {headerGroup.headers.map((column, colIdx) => {
                const sortProps = column.getSortByToggleProps();
                return (
                  <th
                    key={colIdx}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.render('Header')}</span>
                      {column.canSort && (
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDown className="w-4 h-4" />
                            ) : (
                              <ArrowUp className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {page.map((row, rowIdx) => {
            prepareRow(row);
            return (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.cells.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-4 whitespace-nowrap">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // Compact List View
  function CompactView({ page }) {
    return (
      <div className="divide-y divide-gray-200">
        {page.map((row, rowIdx) => {
          prepareRow(row);
          return (
            <div
              key={rowIdx}
              className="py-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="grid grid-cols-12 gap-4">
                {/* Main Info Section */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="font-medium">{row.values.user}</div>
                    <div className="text-sm text-gray-500">
                      {row.values.specialty}
                    </div>
                  </div>
                </div>

                {/* Secondary Info */}
                <div className="col-span-4 flex items-center">
                  <div className="text-sm">
                    <div>{row.values.location}</div>
                    <div className="text-gray-500">{row.values.experience}</div>
                  </div>
                </div>

                {/* Pay Information */}
                <div className="col-span-4 flex items-center justify-end px-4">
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      ${row.values.totalPay.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Base: ${row.values.basePay.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Customize Columns
          </button>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-l-md border text-sm font-medium ${
                viewMode === 'table'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Table
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 rounded-r-md border-t border-r border-b text-sm font-medium ${
                viewMode === 'compact'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              Compact
            </button>
          </div>
        </div>
      </div>

      {showCustomize && <CustomizePanel />}

      <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        {viewMode === 'table' ? (
          <TableView headerGroups={headerGroups} page={page} />
        ) : (
          <CompactView page={page} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
            <span className="font-medium">{pageOptions.length}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NursingCompensationTable;
