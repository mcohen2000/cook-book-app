import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { useOcrRecipe } from '../queries/useRecipes';
import UploadIcon from './icons/UploadIcon';
import PlusIcon from './icons/PlusIcon';
import type { Recipe } from '../types/recipe';
import LoadingSpinner from './LoadingSpinner';

interface OcrExtractorProps {
  onExtracted: (recipe: Recipe) => void;
  setError: (error: string | null) => void;
  error: string | null;
  clearAiResult: () => void;
}

export default function OcrExtractor({
  onExtracted,
  setError,
  error,
  clearAiResult,
}: OcrExtractorProps) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: organizeRecipe, isPending: aiLoading } = useOcrRecipe();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    clearAiResult();
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const fileUrl = URL.createObjectURL(file);
      const { data } = await Tesseract.recognize(fileUrl, 'eng', {});
      setOcrLoading(false);
      organizeRecipe(data.text, {
        onSuccess: (organized) => {
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
          <UploadIcon className='w-6 h-6 text-blue-600' />
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
          <PlusIcon className='w-5 h-5 text-blue-600 mr-2' />
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

      {error && (
        <div className='text-center mb-4'>
          <button
            onClick={() => {
              if (fileInputRef.current && fileInputRef.current.files?.[0]) {
                handleFileChange({
                  target: { files: fileInputRef.current.files },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-2'
          >
            Try Again
          </button>
          <p className='text-sm text-gray-600 mt-2'>
            💡 Tip: If the error persists, try uploading a different photo with
            better lighting or clearer text.
          </p>
        </div>
      )}

      {ocrLoading && (
        <div className='flex items-center justify-center py-4'>
          <LoadingSpinner size={8} />
          <span className='ml-4 text-blue-600 font-medium'>
            Extracting text from image...
          </span>
        </div>
      )}

      {aiLoading && (
        <div className='flex items-center justify-center py-4'>
          <LoadingSpinner size={8} color='green' />
          <span className='ml-4 text-green-600 font-medium'>
            Organizing recipe with AI...
          </span>
        </div>
      )}
    </div>
  );
}
