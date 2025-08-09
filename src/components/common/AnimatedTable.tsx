'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface AnimatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function AnimatedTable<T>({
  data,
  columns,
  keyExtractor,
  className = '',
  onRowClick,
}: AnimatedTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter((item) =>
    Object.values(item as any).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Filter Bar */}
      <motion.div
        initial={false}
        animate={{ height: showFilter ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-gray-50 border-b">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </motion.div>

      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">Data Table</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilter(!showFilter)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      {column.header}
                      <motion.div
                        animate={{
                          rotate: sortConfig.key === column.key && sortConfig.direction === 'desc' ? 180 : 0,
                        }}
                      >
                        {sortConfig.key === column.key ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4 opacity-30" />
                        )}
                      </motion.div>
                    </motion.button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => (
                <motion.tr
                  key={keyExtractor(item)}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination or Info */}
      <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600">
        Showing {filteredData.length} of {data.length} results
      </div>
    </div>
  );
}

// 데이터 변경 시 트랜지션 효과를 위한 래퍼
export function AnimatedDataTransition({
  children,
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center h-64"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          />
        </motion.div>
      ) : isEmpty ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center h-64 text-gray-500"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-4"
          >
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </motion.div>
          <p>{emptyMessage}</p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}