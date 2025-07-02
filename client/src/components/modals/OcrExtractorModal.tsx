import { useState } from 'react';
import OcrExtractor from '../OcrExtractor';
import { useModal } from '../../context/ModalContext';

export default function OcrExtractorModal({
  onExtracted,
}: {
  onExtracted: (json: string) => void;
}) {
  const { closeModal } = useModal();
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExtracted = (text: string) => {
    setAiResult(text);
    setShowSuccess(true);
    try {
      setParsedResult(JSON.parse(text));
    } catch {
      setParsedResult(null);
    }
  };

  const handleConfirm = () => {
    if (aiResult) {
      onExtracted(aiResult);
      closeModal();
    }
  };

  return (
    <div style={{ minWidth: 300 }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
        Extract Recipe from Image or PDF
      </h2>
      <OcrExtractor onExtracted={handleExtracted} suppressSuccess />
      {showSuccess && parsedResult && (
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
              <strong>Title:</strong> {parsedResult.title || 'Not found'}
            </div>
            <div>
              <strong>Description:</strong>{' '}
              {parsedResult.description || 'Not found'}
            </div>
            <div>
              <strong>Ingredients:</strong>{' '}
              {parsedResult.ingredients?.length || 0} found
            </div>
            <div>
              <strong>Instructions:</strong>{' '}
              {parsedResult.instructions?.length || 0} steps
            </div>
            <div>
              <strong>Cooking Time:</strong> {parsedResult.cookingTime || 0}{' '}
              minutes
            </div>
            <div>
              <strong>Servings:</strong> {parsedResult.servings || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
