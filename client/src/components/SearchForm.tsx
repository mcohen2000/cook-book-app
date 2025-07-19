import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

interface SearchFormProps {
  placeholder?: string;
  className?: string;
}

const SearchForm = ({
  placeholder = 'Search...',
  className = '',
}: SearchFormProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className={`px-4 ${className}`}>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <button
          type='submit'
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Search
        </button>
        <button
          type='button'
          onClick={handleClearSearch}
          disabled={!searchQuery}
          className={`px-4 py-2 rounded-lg transition-colors ${
            searchQuery
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
