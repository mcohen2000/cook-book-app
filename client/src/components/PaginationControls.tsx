import { Link, useLocation } from 'react-router';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({
  currentPage = 1,
  totalPages,
}: PaginationProps) {
  const { pathname, search } = useLocation();
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(search);
    params.set('page', newPage.toString());
    return `${pathname}?${params}`;
  };
  return (
    <div className='flex justify-center items-center gap-4 mt-8'>
      {currentPage <= 1 ? (
        <button
          className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition opacity-50 cursor-not-allowed`}
          disabled
          aria-label='Previous page'
        >
          &larr; Previous
        </button>
      ) : (
        <Link
          className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition cursor-pointer hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          to={handlePageChange(currentPage - 1)}
          aria-label='Previous page'
        >
          &larr; Previous
        </Link>
      )}
      <span className='mx-2 text-gray-700 font-semibold text-lg select-none'>
        Page {currentPage} <span className='text-gray-400'>/</span> {totalPages}
      </span>
      {currentPage >= totalPages ? (
        <button
          className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition opacity-50 cursor-not-allowed`}
          disabled
          aria-label='Next page'
        >
          Next &rarr;
        </button>
      ) : (
        <Link
          className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition cursor-pointer hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          to={handlePageChange(currentPage + 1)}
          aria-label='Next page'
        >
          Next &rarr;
        </Link>
      )}
    </div>
  );
}
