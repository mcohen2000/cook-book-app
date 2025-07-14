import { useState } from 'react';
import OcrExtractor from '../OcrExtractor';
import { useModal } from '../../context/ModalContext';
import ErrorIcon from '../icons/ErrorIcon';
import type { Recipe } from '../../types/recipe';

export default function OcrExtractorModal({
  onExtracted,
}: {
  onExtracted: (json: Recipe) => void;
}) {
  const { closeModal } = useModal();
  const [aiResult, setAiResult] = useState<Recipe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtracted = (recipe: Recipe) => {
    setAiResult(recipe);
    setShowSuccess(true);
    setError(null);
  };

  const handleConfirm = () => {
    if (aiResult) {
      onExtracted(aiResult);
      closeModal();
    }
  };

  const clearAiResult = () => {
    setAiResult(null);
    setShowSuccess(false);
  };

  return (
    <div style={{ minWidth: 300 }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
        Extract Recipe from Image or PDF
      </h2>
      <OcrExtractor
        onExtracted={handleExtracted}
        setError={setError}
        error={error}
        clearAiResult={clearAiResult}
      />

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <div className='flex items-center'>
            <ErrorIcon className='w-5 h-5 text-red-500 mr-2' />
            <span className='text-red-700 font-medium'>{error}</span>
          </div>
        </div>
      )}

      {showSuccess && aiResult && (
        <div className='mb-6 p-4 bg-green-50 border border-green-300 rounded-lg'>
          <div className='flex justify-between items-start mb-3'>
            <h3 className='text-lg font-semibold text-green-800'>
              AI Extracted Recipe
            </h3>
            <button
              type='button'
              onClick={handleConfirm}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
            >
              Use AI Result
            </button>
          </div>
          <div className='space-y-2 text-sm'>
            <div>
              <strong>Title:</strong> {aiResult.title || 'Not found'}
            </div>
            <div>
              <strong>Description:</strong>{' '}
              {aiResult.description || 'Not found'}
            </div>
            <div>
              <strong>Ingredients:</strong> {aiResult.ingredients?.length || 0}{' '}
              found
            </div>
            <div>
              <strong>Instructions:</strong>{' '}
              {aiResult.instructions?.length || 0} steps
            </div>
            <div>
              <strong>Cooking Time:</strong> {aiResult.cookingTime || 0} minutes
            </div>
            <div>
              <strong>Servings:</strong> {aiResult.servings || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
