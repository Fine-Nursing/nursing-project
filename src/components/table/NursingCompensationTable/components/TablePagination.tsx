import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from '../types';

export function TablePagination({ meta, onPageChange }: PaginationProps) {
  const handlePreviousPage = () => {
    if (meta && meta.page > 1 && onPageChange) {
      onPageChange(meta.page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && meta.page < meta.totalPages && onPageChange) {
      onPageChange(meta.page + 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        {meta && (
          <p className="text-sm text-gray-700 text-center md:text-left">
            Showing{' '}
            <span className="font-medium">
              {(meta.page - 1) * meta.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className="font-medium">{meta.total}</span> results
          </p>
        )}
      </div>
      <div className="flex items-center justify-center md:justify-end space-x-2">
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={!meta || meta.page <= 1}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {meta && (
          <span className="px-3 py-2 text-sm">
            Page {meta.page} of {meta.totalPages}
          </span>
        )}

        <button
          type="button"
          onClick={handleNextPage}
          disabled={!meta || meta.page >= meta.totalPages}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}