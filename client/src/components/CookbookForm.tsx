import { useState, useEffect } from 'react';
import BackButton from './BackButton';

interface CookbookFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  title: string;
  subtitle: string;
  backTo: string;
  backText: string;
  initialData?: { title: string; description?: string };
  submitText?: string;
  isSubmitting?: boolean;
}

export default function CookbookForm({
  onSubmit,
  title,
  subtitle,
  backTo,
  backText,
  initialData,
  submitText = 'Create Cookbook',
  isSubmitting = false,
}: CookbookFormProps) {
  const defaultData = { title: '', description: '' };
  const [formData, setFormData] = useState(initialData || defaultData);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(initialData || defaultData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description?.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cookbook');
    }
  };

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <BackButton to={backTo} text={backText} />
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-lg p-8'
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
          <p className='mt-2 text-gray-600'>{subtitle}</p>
        </div>
        <div className='space-y-6'>
          {/* Title Field */}
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter cookbook title...'
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Description (Optional)
            </label>
            <textarea
              id='description'
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Describe your cookbook...'
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex justify-end space-x-4 pt-6 border-t'>
            <button
              type='button'
              onClick={() => window.history.back()}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting || !formData.title.trim()}
              className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSubmitting ? 'Saving...' : submitText}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
