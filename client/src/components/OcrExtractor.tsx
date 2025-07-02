import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { useOcrRecipe } from '../queries/useRecipes';

interface OcrExtractorProps {
  onExtracted: (text: string) => void;
  suppressSuccess?: boolean;
}

export default function OcrExtractor({
  onExtracted,
  suppressSuccess = false,
}: OcrExtractorProps) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mutate: organizeRecipe,
    isPending: aiLoading,
    error: aiError,
  } = useOcrRecipe();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setAiResult('');
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const fileUrl = URL.createObjectURL(file);
      const { data } = await Tesseract.recognize(fileUrl, 'eng', {});
      setOcrLoading(false);
      organizeRecipe(data.text, {
        onSuccess: (organized) => {
          setAiResult(organized);
          onExtracted(organized);
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to organize recipe with AI');
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to extract or organize text.');
      setOcrLoading(false);
    }
  };

  return (
    <div className='mb-6 p-6 border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='text-center mb-4'>
        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
          <svg
            className='w-6 h-6 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          Extract Recipe from Image or PDF
        </h3>
        <p className='text-sm text-gray-600'>
          Upload a photo or PDF of your recipe to automatically extract and
          organize it
        </p>
      </div>

      <div className='flex justify-center mb-4'>
        <label className='cursor-pointer inline-flex items-center px-6 py-3 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200'>
          <svg
            className='w-5 h-5 text-blue-600 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Choose File
          <input
            type='file'
            accept='image/*,application/pdf'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      </div>

      {/* Loading States */}
      {ocrLoading && (
        <div className='flex items-center justify-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3'></div>
          <span className='text-blue-600 font-medium'>
            Extracting text from image...
          </span>
        </div>
      )}

      {aiLoading && (
        <div className='flex items-center justify-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3'></div>
          <span className='text-green-600 font-medium'>
            Organizing recipe with AI...
          </span>
        </div>
      )}

      {/* Error State */}
      {(error || aiError) && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 text-red-500 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='text-red-700 font-medium'>
              {error || (aiError as any)?.message}
            </span>
          </div>
        </div>
      )}

      {/* Success State */}
      {!suppressSuccess && aiResult && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <div className='flex items-center mb-3'>
            <svg
              className='w-5 h-5 text-green-600 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
            <span className='text-green-800 font-semibold'>
              Recipe Successfully Extracted!
            </span>
          </div>
          <p className='text-green-700 text-sm'>
            Your recipe has been organized and is ready to use. Click "Use AI
            Result" above to populate the form.
          </p>
        </div>
      )}
    </div>
  );
}
