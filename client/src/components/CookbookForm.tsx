import { useState } from 'react';
import { useCreateCookbook } from '../queries/useBooks';

interface CookbookFormProps {
  onSuccess?: () => void;
}

const CookbookForm = ({ onSuccess }: CookbookFormProps) => {
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const createCookbook = useCreateCookbook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    createCookbook.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          setSuccess('Cookbook created!');
          setTitle('');
          setError('');
          if (onSuccess) onSuccess();
          setTimeout(() => setSuccess(''), 3000);
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to create cookbook');
          setSuccess('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-gray-700 mb-2'>Title</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter cookbook title'
          required
        />
      </div>
      <button
        type='submit'
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={createCookbook.isPending}
      >
        {createCookbook.isPending ? 'Creating...' : 'Create'}
      </button>
      {success && (
        <div className='bg-green-50 border border-green-200 rounded-md p-4 mt-4'>
          <p className='text-green-600 text-sm'>{success}</p>
        </div>
      )}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4 mt-4'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}
    </form>
  );
};

export default CookbookForm;
