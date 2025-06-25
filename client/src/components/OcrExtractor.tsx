import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { useOcrRecipe } from '../queries/useRecipes';

interface OcrExtractorProps {
  onExtracted: (text: string) => void;
}

export default function OcrExtractor({ onExtracted }: OcrExtractorProps) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [aiResult, setAiResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mutate: organizeRecipe,
    isPending: aiLoading,
    error: aiError,
    data: aiData,
  } = useOcrRecipe();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOcrResult('');
    setAiResult('');
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const fileUrl = URL.createObjectURL(file);
      const { data } = await Tesseract.recognize(fileUrl, 'eng', {
        logger: (m) => {},
      });
      setOcrResult(data.text);
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
    <div className='mb-6 p-4 border rounded-md bg-gray-50'>
      <label className='block mb-2 font-medium'>
        Extract Recipe from Image or PDF
      </label>
      <input
        type='file'
        accept='image/*,application/pdf'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='mb-2'
      />
      {ocrLoading && <div className='text-blue-600'>Extracting text...</div>}
      {aiLoading && (
        <div className='text-blue-600'>Organizing recipe with AI...</div>
      )}
      {(error || aiError) && (
        <div className='text-red-500'>{error || (aiError as any)?.message}</div>
      )}
      {ocrResult && (
        <div className='mt-2 p-2 bg-white border rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto'>
          <strong>Raw Extracted Text:</strong>
          <div>{ocrResult}</div>
        </div>
      )}
      {aiResult && (
        <div className='mt-4 p-2 bg-green-50 border border-green-300 rounded text-sm whitespace-pre-wrap max-h-60 overflow-y-auto'>
          <strong>Organized Recipe (AI):</strong>
          <div>{aiResult}</div>
        </div>
      )}
    </div>
  );
}
