type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className='flex justify-center items-center gap-4 mt-8'>
      <button
        className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${
          currentPage <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label='Previous page'
      >
        &larr; Previous
      </button>
      <span className='mx-2 text-gray-700 font-semibold text-lg select-none'>
        Page {currentPage} <span className='text-gray-400'>/</span> {totalPages}
      </span>
      <button
        className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${
          currentPage >= totalPages ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label='Next page'
      >
        Next &rarr;
      </button>
    </div>
  );
}
